import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { Tirage } from '../../models/tirage-model';
import { TitleComponent } from '../../ui_shared/title/title.component';
import { ButtonComponent } from '../../ui_shared/button/button.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-tirage-gagnant',
  standalone: true,
  imports: [TitleComponent, ButtonComponent, CommonModule, FormsModule],
  templateUrl: './tirage-gagnant.component.html',
  styleUrl: './tirage-gagnant.component.css',
})
export class TirageGagnantComponent {
  @Output() winningTirageSelected = new EventEmitter<Tirage>(); // Événement à envoyer après sélection du tirage gagnant

  maxNumeros: number = 49; // Maximum de numéros possibles
  maxEtoiles: number = 9; // Maximum d'étoiles possibles
  maxNumerosSelection: number = 5; // Nombre de numéros à sélectionner
  maxEtoilesSelection: number = 2; // Nombre d'étoiles à sélectionner

  numeros: number[] = Array.from({ length: this.maxNumeros }, (_, i) => i + 1); // Tableau de 1 à 49
  etoiles: number[] = Array.from({ length: this.maxEtoiles }, (_, i) => i + 1); // Tableau de 1 à 9

  selectedNumeros: number[] = [];
  selectedEtoiles: number[] = [];
  pseudo: string = '';

  isManualWinningDraw: boolean = false;

  // Méthode pour diviser les nombres en rangées
  getRows(array: number[], itemsPerRow: number): number[][] {
    const rows = [];
    for (let i = 0; i < array.length; i += itemsPerRow) {
      rows.push(array.slice(i, i + itemsPerRow));
    }
    return rows;
  }

  // Toggle pour sélectionner/désélectionner un numéro
  toggleNumeroSelection(numero: number): void {
    if (this.selectedNumeros.includes(numero)) {
      this.selectedNumeros = this.selectedNumeros.filter((n) => n !== numero);
    } else if (this.selectedNumeros.length < this.maxNumerosSelection) {
      this.selectedNumeros.push(numero);
    }
  }

  // Toggle pour sélectionner/désélectionner une étoile
  toggleEtoileSelection(etoile: number): void {
    if (this.selectedEtoiles.includes(etoile)) {
      this.selectedEtoiles = this.selectedEtoiles.filter((e) => e !== etoile);
    } else if (this.selectedEtoiles.length < this.maxEtoilesSelection) {
      this.selectedEtoiles.push(etoile);
    }
  }

  // Vérification si le numéro est sélectionné
  isNumeroSelected(numero: number): boolean {
    return this.selectedNumeros.includes(numero);
  }

  // Vérification si l'étoile est sélectionnée
  isEtoileSelected(etoile: number): boolean {
    return this.selectedEtoiles.includes(etoile);
  }

  // Méthode pour valider le tirage gagnant manuel
  validateWinningDraw(): void {
    if (
      this.selectedNumeros.length === this.maxNumerosSelection &&
      this.selectedEtoiles.length === this.maxEtoilesSelection
    ) {
      const tirageGagnant = new Tirage(
        this.pseudo,
        [...this.selectedNumeros],
        [...this.selectedEtoiles],
      );
      this.winningTirageSelected.emit(tirageGagnant); // Émet le tirage gagnant
    }
  }

  // Méthode pour générer un tirage gagnant automatiquement
  generateWinningDraw(): void {
    this.selectedNumeros = this.generateRandomSelection(
      this.maxNumeros,
      this.maxNumerosSelection,
    );
    this.selectedEtoiles = this.generateRandomSelection(
      this.maxEtoiles,
      this.maxEtoilesSelection,
    );
    const tirageGagnant = new Tirage(
      this.pseudo,
      [...this.selectedNumeros],
      [...this.selectedEtoiles],
    );
    this.winningTirageSelected.emit(tirageGagnant); // Émet le tirage gagnant
  }

  // Générer une sélection aléatoire
  private generateRandomSelection(max: number, count: number): number[] {
    const selected: number[] = [];
    while (selected.length < count) {
      const random = Math.floor(Math.random() * max) + 1;
      if (!selected.includes(random)) {
        selected.push(random);
      }
    }
    return selected;
  }
}
