import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TitleComponent } from '../../ui_shared/title/title.component';
import { Tirage } from '../../models/tirage-model';
import { ButtonComponent } from '../../ui_shared/button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grille',
  standalone: true,
  imports: [CommonModule, TitleComponent, ButtonComponent, FormsModule],
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.css'],
})
export class GrilleComponent {
  // Inputs to get total number of participants and number of draws from the parent component
  @Input() totalParticipants!: number;
  @Input() numberOfDraws!: number;
  @Output() tiragesByUser = new EventEmitter<Tirage[]>(); // Declare the output event
  @Output() indexHideSend = new EventEmitter<number>(); // Declare the output event

  // Constants for maximum numbers and stars
  maxNumeros: number = 49; // Maximum numbers available to select
  maxEtoiles: number = 9; // Maximum stars available to select

  // Constants for the required selection
  readonly maxNumerosSelection: number = 5; // Number of numbers to be selected
  readonly maxEtoilesSelection: number = 2; // Number of stars to be selected

  // Arrays to store numbers and stars for selection
  numeros: number[] = Array.from({ length: this.maxNumeros }, (_, i) => i + 1); // [1, 2, ..., 49]
  etoiles: number[] = Array.from({ length: this.maxEtoiles }, (_, i) => i + 1); // [1, 2, ..., 9]

  // Arrays to store the selected numbers and stars
  selectedNumeros: number[] = [];
  selectedEtoiles: number[] = [];

  currentIndex: number = 0; // Index of the current draw
  tirages: Tirage[] = [];
  pseudo: string = '';
  indexHide: number = 0;

  getRows(array: number[], itemsPerRow: number): number[][] {
    const rows = [];
    for (let i = 0; i < array.length; i += itemsPerRow) {
      rows.push(array.slice(i, i + itemsPerRow));
    }
    return rows;
  }

  // Method to toggle the selection of a number
  toggleNumeroSelection(numero: number): void {
    if (this.selectedNumeros.includes(numero)) {
      this.selectedNumeros = this.selectedNumeros.filter((n) => n !== numero);
    } else if (this.selectedNumeros.length < this.maxNumerosSelection) {
      this.selectedNumeros.push(numero);
    }
  }

  // Method to toggle the selection of a star
  toggleEtoileSelection(etoile: number): void {
    if (this.selectedEtoiles.includes(etoile)) {
      this.selectedEtoiles = this.selectedEtoiles.filter((e) => e !== etoile);
    } else if (this.selectedEtoiles.length < this.maxEtoilesSelection) {
      this.selectedEtoiles.push(etoile);
    }
  }

  // Method to check if a number is selected
  isNumeroSelected(numero: number): boolean {
    return this.selectedNumeros.includes(numero);
  }

  // Method to check if a star is selected
  isEtoileSelected(etoile: number): boolean {
    return this.selectedEtoiles.includes(etoile);
  }

  get isFirstDraw(): boolean {
    return this.currentIndex === 0;
  }

  get isLastDraw(): boolean {
    return this.currentIndex === this.numberOfDraws - 1;
  }

  get isSelectionValid(): boolean {
    return (
      this.selectedNumeros.length === this.maxNumerosSelection &&
      this.selectedEtoiles.length === this.maxEtoilesSelection &&
      this.pseudo !== ''
    );
  }
  validateSelection(): void {
    if (this.isSelectionValid) {
      const nouveauTirage = new Tirage(
        this.pseudo,
        [...this.selectedNumeros],
        [...this.selectedEtoiles],
      );
      this.tirages[this.currentIndex] = nouveauTirage;
      console.log('Nouveau tirage ajouté : ', nouveauTirage);
      this.resetSelection(); // Reset selection after validation
      this.indexHide++;
      this.indexHideSend.emit(this.indexHide);
      this.tiragesByUser.emit([...this.tirages]);
      if (this.isLastDraw) {
        this.generateRemainingDraws(); // Appel à la méthode qui va générer les autres tirages
      }
    }
  }
  generateRemainingDraws(): void {
    for (let i = this.currentIndex + 1; i < this.totalParticipants; i++) {
      this.generatePseudo(); // Réutilisation de la fonction existante pour générer un pseudo aléatoire
      this.generateRandomNumbers(); // Réutilisation de la fonction existante pour générer des numéros aléatoires
      this.generateRandomStars(); // Réutilisation de la fonction existante pour générer des étoiles aléatoires
      const autoTirage = new Tirage(
        this.pseudo,
        this.selectedNumeros,
        this.selectedEtoiles,
      );

      this.tirages[i] = autoTirage;
      console.log('Tirage auto généré : ', autoTirage);
    }

    // Envoyer tous les tirages une fois que tout est généré
    this.tiragesByUser.emit([...this.tirages]);
  }

  // Method to reset the selection after validation
  resetSelection(): void {
    this.selectedNumeros = [];
    this.selectedEtoiles = [];
    this.pseudo = '';
  }

  // Method to go to the next draw
  nextDraw(): void {
    if (this.isSelectionValid) {
      this.validateSelection();
      if (!this.isLastDraw) {
        this.currentIndex++;
        this.loadSelection();
      }
    }
  }

  // Method to go to the previous draw
  previousDraw(): void {
    if (!this.isFirstDraw) {
      this.validateSelection();
      this.currentIndex--;
      this.loadSelection();
    }
  }

  // Method to load an existing selection if one has been made
  loadSelection(): void {
    const currentTirage = this.tirages[this.currentIndex];
    if (currentTirage) {
      this.selectedNumeros = [...currentTirage.numeros];
      this.selectedEtoiles = [...currentTirage.etoiles];
      this.pseudo = currentTirage.pseudo;
    } else {
      this.resetSelection();
    }
  }

  get titleNumeroText(): string {
    return `Grille des numéros (Sélectionnez ${this.maxNumerosSelection} numéros)`;
  }

  get titleEtoileText(): string {
    return `Grille des numéros (Sélectionnez ${this.maxNumerosSelection} numéros)`;
  }

  get titleIndexText(): string {
    return ` ${this.currentIndex + 1}/${this.numberOfDraws}`;
  }

  generatePseudo(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';

    // Générer un pseudo de 8 à 12 caractères, composé de lettres et chiffres
    const pseudoLength = Math.floor(Math.random() * 5) + 8; // Longueur entre 8 et 12
    let pseudo = '';

    for (let i = 0; i < pseudoLength; i++) {
      // Choisir aléatoirement entre lettre ou chiffre
      const isLetter = Math.random() < 0.7; // 70% de chance d'avoir une lettre

      if (isLetter) {
        pseudo += letters.charAt(Math.floor(Math.random() * letters.length));
      } else {
        pseudo += digits.charAt(Math.floor(Math.random() * digits.length));
      }
    }

    this.pseudo = pseudo;
  }

  generateRandomNumbers(): void {
    this.selectedNumeros = [];
    while (this.selectedNumeros.length < this.maxNumerosSelection) {
      const randomNum = Math.floor(Math.random() * this.maxNumeros) + 1; // Générez un numéro entre 1 et maxNumeros
      if (!this.selectedNumeros.includes(randomNum)) {
        this.selectedNumeros.push(randomNum); // Ajoutez un numéro s'il n'est pas déjà sélectionné
      }
    }
  }

  // Générer des étoiles aléatoires
  generateRandomStars(): void {
    this.selectedEtoiles = [];
    while (this.selectedEtoiles.length < this.maxEtoilesSelection) {
      const randomStar = Math.floor(Math.random() * this.maxEtoiles) + 1; // Générez une étoile entre 1 et maxEtoiles
      if (!this.selectedEtoiles.includes(randomStar)) {
        this.selectedEtoiles.push(randomStar); // Ajoutez une étoile si elle n'est pas déjà sélectionnée
      }
    }
  }

  // Fonction pour générer tout (pseudo, numéros, étoiles)
  generateAll(): void {
    this.generatePseudo(); // Générer un pseudo aléatoire
    this.generateRandomNumbers(); // Générer des numéros aléatoires
    this.generateRandomStars(); // Générer des étoiles aléatoires
  }
}
