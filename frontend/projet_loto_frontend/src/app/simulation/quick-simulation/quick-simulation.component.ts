import { Component } from '@angular/core';
import { ButtonComponent } from '../../ui_shared/button/button.component'; // Import du composant bouton partagé
import { CommonModule } from '@angular/common'; // Module commun Angular
import { FormsModule } from '@angular/forms'; // Module des formulaires Angular
import { NumberGridComponent } from '../../ui_shared/number-grid/number-grid.component'; // Composant pour la grille de numéros
import { TitleComponent } from '../../ui_shared/title/title.component'; // Composant pour les titres partagés
import { VariableService } from '../../services/variableservices/variable.service'; // Service pour les variables partagées
import { BdTirageService } from '../../services/bdservices/bd-tirage.service'; // Service pour interagir avec la base de données des tirages
import { Tirage } from '../../models/tirage-model'; // Modèle de données pour un tirage
import { Router } from '@angular/router'; // Service Angular pour la navigation

@Component({
  selector: 'app-quick-simulation', // Sélecteur du composant
  standalone: true, // Composant autonome
  imports: [
    ButtonComponent,
    CommonModule,
    FormsModule,
    NumberGridComponent,
    TitleComponent,
  ], // Import des modules et composants nécessaires
  templateUrl: './quick-simulation.component.html', // Template HTML du composant
  styleUrl: './quick-simulation.component.css', // Style CSS du composant
})
export class QuickSimulationComponent {
  constructor(
    private service: VariableService, // Service pour gérer les variables
    private serviceBd: BdTirageService, // Service pour interagir avec la base de données
    private router: Router, // Service de navigation Angular
  ) {}

  // Déclaration des propriétés du composant
  pseudo: string = ''; // Pseudo de l'utilisateur
  selectedNumbers: number[] = []; // Numéros sélectionnés pour le ticket
  selectedStars: number[] = []; // Étoiles sélectionnées pour le ticket
  selectedNumbersString: string = ''; // Chaîne des numéros sélectionnés
  selectedStarsString: string = ''; // Chaîne des étoiles sélectionnées
  showNumberGrid: boolean = false; // Indicateur pour afficher ou non la grille de numéros
  showStarGrid: boolean = false; // Indicateur pour afficher ou non la grille d'étoiles
  showPseudoError: boolean = false; // Indicateur pour afficher une erreur sur le pseudo
  showNumbersError: boolean = false; // Indicateur pour afficher une erreur sur les numéros
  showStarsError: boolean = false; // Indicateur pour afficher une erreur sur les étoiles
  maxNumberSelections: number = this.service.selectionMaxNumber; // Nombre maximum de numéros à sélectionner
  maxStarSelections: number = this.service.selectionMaxStar; // Nombre maximum d'étoiles à sélectionner
  isPseudoSelected: boolean = false; // Flag pour désactiver l'input si un pseudo est sélectionné
  pseudoMessage: string = ''; // Message relatif au pseudo
  tirages: Tirage[] = []; // Liste des tirages effectués
  users: any[] = []; // Liste des utilisateurs depuis la base de données
  filteredUsers: any[] = []; // Liste filtrée des utilisateurs
  showPseudoList: boolean = false; // Flag pour afficher ou masquer la liste des pseudos
  searchTerm: string = ''; // Terme de recherche pour filtrer les pseudos
  totalParticipants: number = this.service.nbParticipant; // Nombre total de participants
  numberOfDraws: number = this.service.numberOfDraws; // Nombre de tirages
  montantTotal: number = this.service.sommeTirage; // Montant total de la partie

  // Générer un pseudo aléatoire
  generatePseudo(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const pseudoLength = Math.floor(Math.random() * 5) + 8; // Longueur du pseudo entre 8 et 12
    let randomPseudo = '';

    // Génération d'un pseudo aléatoire avec une combinaison de lettres et chiffres
    for (let i = 0; i < pseudoLength; i++) {
      const isLetter = Math.random() < 0.7; // 70% de chances d'obtenir une lettre
      if (isLetter) {
        randomPseudo += letters.charAt(
          Math.floor(Math.random() * letters.length),
        );
      } else {
        randomPseudo += digits.charAt(
          Math.floor(Math.random() * digits.length),
        );
      }
    }

    this.pseudo = randomPseudo;
    this.checkPseudo(); // Vérifier si le pseudo est déjà pris
  }

  // Générer des numéros aléatoires
  generateRandomNumbers(): void {
    this.selectedNumbers = [];
    while (this.selectedNumbers.length < this.maxNumberSelections) {
      const randomNum = Math.floor(Math.random() * this.service.gridNumero) + 1; // Générer un numéro entre 1 et 50
      if (!this.selectedNumbers.includes(randomNum)) {
        this.selectedNumbers.push(randomNum);
      }
    }
    this.selectedNumbersString = this.selectedNumbers.join(', '); // Convertir les numéros en chaîne
    this.showNumbersError = false; // Réinitialiser l'erreur sur les numéros
  }

  // Générer des étoiles aléatoires
  generateRandomStars(): void {
    this.selectedStars = [];
    while (this.selectedStars.length < this.maxStarSelections) {
      const randomStar =
        Math.floor(Math.random() * this.service.gridEtoile) + 1; // Générer une étoile entre 1 et 12
      if (!this.selectedStars.includes(randomStar)) {
        this.selectedStars.push(randomStar);
      }
    }
    this.selectedStarsString = this.selectedStars.join(', '); // Convertir les étoiles en chaîne
    this.showStarsError = false; // Réinitialiser l'erreur sur les étoiles
  }

  // Générer tout : pseudo, numéros et étoiles
  generateAll(): void {
    if (this.isPseudoSelected) {
      this.generateRandomNumbers();
      this.generateRandomStars();
    } else {
      this.generatePseudo();
      this.generateRandomNumbers();
      this.generateRandomStars();
    }
  }

  // Ouvrir la grille pour les numéros
  openNumberGrid(): void {
    this.showNumberGrid = true;
  }

  // Ouvrir la grille pour les étoiles
  openStarGrid(): void {
    this.showStarGrid = true;
  }

  // Lorsque les numéros sont sélectionnés, les afficher dans l'input
  onNumbersSelected(numbers: number[]): void {
    this.selectedNumbers = numbers;
    this.selectedNumbersString = numbers.join(', ');
    this.showNumbersError =
      this.selectedNumbers.length !== this.maxNumberSelections;
    this.showNumberGrid = false; // Fermer la grille après sélection
  }

  // Lorsque les étoiles sont sélectionnées, les afficher dans l'input
  onStarsSelected(stars: number[]): void {
    this.selectedStars = stars;
    this.selectedStarsString = stars.join(', ');
    this.showStarsError = this.selectedStars.length !== this.maxStarSelections;
    this.showStarGrid = false; // Fermer la grille après sélection
  }

  // Fermer la grille
  closeGrid(): void {
    this.showNumberGrid = false;
    this.showStarGrid = false;
  }

  // Vérification si le formulaire est valide
  isFormValid(): boolean {
    const numbersArray = this.selectedNumbersString
      .split(',')
      .map((num) => num.trim()) // Enlever les espaces
      .filter(Boolean); // Filtrer les valeurs non valides
    const starsArray = this.selectedStarsString
      .split(',')
      .map((star) => star.trim())
      .filter(Boolean);

    return (
      !this.showPseudoError && // Pas d'erreur sur le pseudo
      this.pseudo.trim() !== '' && // Le pseudo ne doit pas être vide
      numbersArray.length === this.maxNumberSelections && // Vérifier qu'il y a 5 numéros
      starsArray.length === this.maxStarSelections // Vérifier qu'il y a 2 étoiles
    );
  }

  // Vérification de la disponibilité du pseudo
  async checkPseudo(): Promise<void> {
    this.pseudo = this.pseudo.replace(/\s+/g, ''); // Enlever les espaces dans le pseudo
    this.showPseudoError = this.pseudo.trim() === ''; // Vérifier si le pseudo est vide

    if (this.showPseudoError) {
      this.pseudoMessage = 'Le pseudo ne doit pas être vide.';
      return;
    }
    // Vérification de la longueur du pseudo (max 50 caractères)
    if (this.pseudo.length > 50) {
      this.showPseudoError = true;
      this.pseudoMessage = 'Le pseudo ne doit pas dépasser 50 caractères.';
      return;
    }
    // Vérifier si le pseudo est déjà utilisé dans les tirages existants
    const pseudoExistsInTable = this.tirages.some(
      (tirage) => tirage.pseudo.toLowerCase() === this.pseudo.toLowerCase(),
    );

    if (pseudoExistsInTable) {
      this.showPseudoError = true;
      this.pseudoMessage =
        'Ce pseudo est déjà utilisé dans le tableau des tickets.';
      return;
    }

    if (this.isPseudoSelected) {
      this.showPseudoError = false;
      return;
    }

    try {
      // Vérification de l'existence du pseudo dans la base de données
      const response = await this.serviceBd.checkPseudo(this.pseudo);
      if (response && response.exists) {
        this.showPseudoError = true;
        this.pseudoMessage = 'Ce pseudo est déjà pris dans la base de données.';
      } else {
        this.showPseudoError = false;
        this.pseudoMessage = 'Ce pseudo est disponible.';
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du pseudo', error);
    }
  }

  // Récupérer les pseudos depuis la base de données
  fetchPseudosFromDB(): void {
    this.serviceBd.getPseudo().subscribe((response: any) => {
      this.users = response; // Assigner la réponse à la liste des utilisateurs
      this.filteredUsers = this.users; // Initialiser la liste filtrée
      this.showPseudoList = true; // Afficher la liste des pseudos
    });
  }

  // Réactiver l'édition du pseudo
  enablePseudoEdit(): void {
    this.pseudo = '';
    this.isPseudoSelected = false;
    this.pseudoMessage = '';
  }

  // Fermer la liste des pseudos
  closePseudoList(): void {
    this.showPseudoList = false;
  }

  // Sélectionner un pseudo avec double clic
  selectPseudo(user: any): void {
    this.pseudo = user.pseudo; // Mettre à jour le pseudo avec celui sélectionné
    this.isPseudoSelected = true; // Désactiver l'édition du pseudo
    this.showPseudoList = false; // Fermer la liste des pseudos
    this.showPseudoError = false; // Réinitialiser l'erreur sur le pseudo
    this.pseudoMessage = 'Pseudo sélectionné depuis la base de données.'; // Afficher un message de succès
  }

  // Filtrer la liste des pseudos en fonction du terme de recherche
  filterPseudoList(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredUsers = this.users.filter((user) =>
        user.pseudo.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    } else {
      this.filteredUsers = this.users; // Réinitialiser la liste si la recherche est vide
    }
  }

  // Générer un tirage gagnant aléatoire
  generateRandomTirageWin(): Tirage {
    const randomNumbers: number[] = [];
    const randomStars: number[] = [];

    const maxNumberLimit = this.service.gridNumero; // Limite maximale pour les numéros (ex: 50)
    const maxStarLimit = this.service.gridEtoile; // Limite maximale pour les étoiles (ex: 12)

    // Générer 5 numéros uniques aléatoires
    while (randomNumbers.length < this.service.selectionMaxNumber) {
      const randomNum = Math.floor(Math.random() * maxNumberLimit) + 1;
      if (!randomNumbers.includes(randomNum)) {
        randomNumbers.push(randomNum);
      }
    }

    // Générer 2 étoiles uniques aléatoires
    while (randomStars.length < this.service.selectionMaxStar) {
      const randomStar = Math.floor(Math.random() * maxStarLimit) + 1;
      if (!randomStars.includes(randomStar)) {
        randomStars.push(randomStar);
      }
    }

    return new Tirage('', randomNumbers, randomStars); // Retourner un objet Tirage
  }

  // Validation du ticket
  async validateTicket(): Promise<void> {
    await this.checkPseudo(); // Vérifier le pseudo

    const numbersArray = this.selectedNumbersString
      .split(',')
      .map((num) => num.trim())
      .filter(Boolean);
    const starsArray = this.selectedStarsString
      .split(',')
      .map((star) => star.trim())
      .filter(Boolean);

    this.showNumbersError = numbersArray.length !== this.maxNumberSelections; // Vérifier les numéros
    this.showStarsError = starsArray.length !== this.maxStarSelections; // Vérifier les étoiles

    if (this.isFormValid()) {
      const newTirage = new Tirage(
        this.pseudo,
        this.selectedNumbers,
        this.selectedStars,
      );
      this.tirages.push(newTirage); // Ajouter le tirage à la liste

      const randomTirageWin = this.generateRandomTirageWin(); // Générer un tirage gagnant
      this.generateAdditionalDraws(); // Générer des tirages supplémentaires

      // Navigation vers la page des résultats
      this.router.navigate(['/resultat-simulation'], {
        state: {
          tirages: this.tirages,
          totalParticipants: this.totalParticipants,
          numberOfDraws: this.numberOfDraws,
          montantTotal: this.montantTotal,
          tirageWin: randomTirageWin, // Tirage gagnant
        },
      });
    }
  }

  // Générer des tirages supplémentaires pour les participants restants
  generateAdditionalDraws(): void {
    const remainingParticipants = this.totalParticipants - this.numberOfDraws;

    for (let i = 0; i < remainingParticipants; i++) {
      this.generateAll(); // Générer un tirage pour chaque participant restant
      const newTirage = new Tirage(
        this.pseudo,
        this.selectedNumbers,
        this.selectedStars,
      );
      this.tirages.push(newTirage); // Ajouter chaque tirage à la liste
    }
  }
}
