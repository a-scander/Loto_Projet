import { Component, OnInit } from '@angular/core'; // Import de la classe `Component` et de l'interface `OnInit` pour gérer le cycle de vie du composant
import { Router } from '@angular/router'; // Service Angular pour la navigation
import { Tirage } from '../../models/tirage-model'; // Modèle pour les tirages (numéros et étoiles)
import { ButtonComponent } from '../../ui_shared/button/button.component'; // Composant pour les boutons partagés
import { CommonModule } from '@angular/common'; // Module Angular de base
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Modules pour la gestion des formulaires réactifs
import { VariableService } from '../../services/variableservices/variable.service'; // Service pour gérer les variables partagées
import { TitleComponent } from '../../ui_shared/title/title.component'; // Composant pour les titres partagés
import { NumberGridComponent } from '../../ui_shared/number-grid/number-grid.component'; // Composant pour la grille de sélection des numéros

@Component({
  selector: 'app-ticket-win-form', // Sélecteur utilisé pour ce composant dans les templates HTML
  standalone: true, // Composant autonome, sans dépendance à un module spécifique
  imports: [
    ButtonComponent, // Utilisation des boutons partagés dans le template
    CommonModule, // Fonctionnalités Angular de base (ngIf, ngFor, etc.)
    ReactiveFormsModule, // Formulaires réactifs pour la gestion des entrées utilisateur
    FormsModule, // Formulaires Angular pour les formulaires simples
    TitleComponent, // Utilisation du composant pour afficher des titres
    NumberGridComponent, // Utilisation de la grille de sélection de numéros
  ],
  templateUrl: './ticket-win-form.component.html', // Chemin vers le fichier template HTML
  styleUrl: './ticket-win-form.component.css', // Chemin vers le fichier de style CSS
})
export class TicketWinFormComponent implements OnInit {
  // Propriétés du composant
  totalParticipants!: number; // Nombre total de participants à la simulation
  numberOfDraws!: number; // Nombre de tirages
  montantTotal!: number; // Montant total du gain de la simulation
  tirages: Tirage[] = []; // Tableau de tirages récupérés
  selectedNumbers: number[] = []; // Numéros sélectionnés par l'utilisateur
  selectedStars: number[] = []; // Étoiles sélectionnées par l'utilisateur
  selectedNumbersString: string = ''; // Chaîne de caractères pour afficher les numéros sélectionnés
  selectedStarsString: string = ''; // Chaîne de caractères pour afficher les étoiles sélectionnées
  maxNumberSelections: number = this.service.selectionMaxNumber; // Nombre maximum de numéros à sélectionner (défini dans `VariableService`)
  maxStarSelections: number = this.service.selectionMaxStar; // Nombre maximum d'étoiles à sélectionner (défini dans `VariableService`)
  showNumbersError: boolean = false; // Indicateur pour afficher une erreur si les numéros sélectionnés sont incorrects
  showStarsError: boolean = false; // Indicateur pour afficher une erreur si les étoiles sélectionnées sont incorrectes
  showNumberGrid: boolean = false; // Indicateur pour afficher la grille de numéros
  showStarGrid: boolean = false; // Indicateur pour afficher la grille d'étoiles
  tirageWin!: Tirage; // Tirage gagnant sélectionné ou généré

  constructor(
    private router: Router, // Service pour la navigation entre les pages
    private service: VariableService, // Service pour accéder aux variables de sélection (numéros, étoiles)
  ) {}

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    // Récupérer les données de la page précédente via `history.state`
    const state = history.state;

    if (
      state &&
      state.totalParticipants &&
      state.numberOfDraws &&
      state.montantTotal &&
      state.tirages
    ) {
      this.totalParticipants = state.totalParticipants; // Récupération du nombre total de participants
      this.numberOfDraws = state.numberOfDraws; // Récupération du nombre de tirages
      this.montantTotal = state.montantTotal; // Récupération du montant total du gain
      this.tirages = state.tirages; // Récupération du tableau des tirages
    }
  }

  // Générer des numéros aléatoires pour le tirage
  generateRandomNumbers(): void {
    this.selectedNumbers = []; // Réinitialiser les numéros sélectionnés
    while (this.selectedNumbers.length < this.maxNumberSelections) {
      const randomNum = Math.floor(Math.random() * this.service.gridNumero) + 1; // Générer un numéro entre 1 et 50
      if (!this.selectedNumbers.includes(randomNum)) {
        this.selectedNumbers.push(randomNum); // Ajouter le numéro s'il n'est pas déjà sélectionné
      }
    }
    this.selectedNumbersString = this.selectedNumbers.join(', '); // Transformer les numéros en chaîne de caractères
    this.showNumbersError = false; // Réinitialiser l'erreur sur les numéros
  }

  // Générer des étoiles aléatoires pour le tirage
  generateRandomStars(): void {
    this.selectedStars = []; // Réinitialiser les étoiles sélectionnées
    while (this.selectedStars.length < this.maxStarSelections) {
      const randomStar =
        Math.floor(Math.random() * this.service.gridEtoile) + 1; // Générer une étoile entre 1 et 12
      if (!this.selectedStars.includes(randomStar)) {
        this.selectedStars.push(randomStar); // Ajouter l'étoile si elle n'est pas déjà sélectionnée
      }
    }
    this.selectedStarsString = this.selectedStars.join(', '); // Transformer les étoiles en chaîne de caractères
    this.showStarsError = false; // Réinitialiser l'erreur sur les étoiles
  }

  // Générer à la fois des numéros et des étoiles aléatoires
  generateAll(): void {
    this.generateRandomNumbers(); // Générer les numéros aléatoires
    this.generateRandomStars(); // Générer les étoiles aléatoires
  }

  // Ouvrir la grille de sélection pour les numéros
  openNumberGrid(): void {
    this.showNumberGrid = true;
  }

  // Ouvrir la grille de sélection pour les étoiles
  openStarGrid(): void {
    this.showStarGrid = true;
  }

  // Fermer les grilles de sélection
  closeGrid(): void {
    this.showNumberGrid = false;
    this.showStarGrid = false;
  }

  // Vérifier si le formulaire est valide
  isFormValid(): boolean {
    const numbersArray = this.selectedNumbersString
      .split(',') // Séparer les numéros en un tableau
      .map((num) => num.trim()) // Enlever les espaces superflus
      .filter(Boolean); // Enlever les valeurs nulles ou vides
    const starsArray = this.selectedStarsString
      .split(',') // Séparer les étoiles en un tableau
      .map((star) => star.trim())
      .filter(Boolean);

    // Valider qu'il y a bien le nombre correct de numéros et d'étoiles
    return (
      numbersArray.length === this.maxNumberSelections && // Vérifier qu'il y a bien 5 numéros
      starsArray.length === this.maxStarSelections // Vérifier qu'il y a bien 2 étoiles
    );
  }

  // Gestion de la sélection des numéros
  onNumbersSelected(numbers: number[]): void {
    this.selectedNumbers = numbers; // Mettre à jour les numéros sélectionnés
    this.selectedNumbersString = numbers.join(', '); // Mettre à jour la chaîne de numéros
    this.showNumbersError =
      this.selectedNumbers.length !== this.maxNumberSelections; // Vérifier que le bon nombre de numéros est sélectionné
    this.showNumberGrid = false; // Fermer la grille après la sélection
  }

  // Gestion de la sélection des étoiles
  onStarsSelected(stars: number[]): void {
    this.selectedStars = stars; // Mettre à jour les étoiles sélectionnées
    this.selectedStarsString = stars.join(', '); // Mettre à jour la chaîne d'étoiles
    this.showStarsError = this.selectedStars.length !== this.maxStarSelections; // Vérifier que le bon nombre d'étoiles est sélectionné
    this.showStarGrid = false; // Fermer la grille après la sélection
  }

  // Validation du ticket gagnant et redirection vers la page des résultats
  validateTicket(): void {
    const numbersArray = this.selectedNumbersString
      .split(',')
      .map((num) => num.trim())
      .filter(Boolean);
    const starsArray = this.selectedStarsString
      .split(',')
      .map((star) => star.trim())
      .filter(Boolean);

    // Vérifier si les sélections de numéros et d'étoiles sont correctes
    this.showNumbersError = numbersArray.length !== this.maxNumberSelections; // Vérifier qu'il y a bien 5 numéros
    this.showStarsError = starsArray.length !== this.maxStarSelections; // Vérifier qu'il y a bien 2 étoiles
    if (this.isFormValid()) {
      // Si tout est correct, créer un objet `Tirage` pour le tirage gagnant
      this.tirageWin = new Tirage('', this.selectedNumbers, this.selectedStars);

      // Rediriger vers la page des résultats avec les données du tirage gagnant et des autres paramètres
      this.router.navigate(['/resultat-simulation'], {
        state: {
          tirages: this.tirages, // Les tirages précédents
          totalParticipants: this.totalParticipants, // Nombre total de participants
          numberOfDraws: this.numberOfDraws, // Nombre de tirages
          montantTotal: this.montantTotal, // Montant total du gain
          tirageWin: this.tirageWin, // Le tirage gagnant
        },
      });
    }
  }
}
