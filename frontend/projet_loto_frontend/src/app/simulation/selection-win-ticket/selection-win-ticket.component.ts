import { Component, OnInit } from '@angular/core'; // Import de la classe `Component` et de l'interface `OnInit` pour la gestion du cycle de vie du composant
import { Router } from '@angular/router'; // Service Angular pour la navigation entre les pages
import { TitleComponent } from '../../ui_shared/title/title.component'; // Composant partagé pour afficher des titres
import { Tirage } from '../../models/tirage-model'; // Modèle de données `Tirage` pour représenter un tirage de loterie
import { ButtonComponent } from '../../ui_shared/button/button.component'; // Composant partagé pour les boutons
import { CommonModule } from '@angular/common'; // Module commun pour l'utilisation des directives Angular de base
import { FormsModule } from '@angular/forms'; // Module pour la gestion des formulaires
import { VariableService } from '../../services/variableservices/variable.service'; // Service pour gérer les variables partagées dans l'application

@Component({
  selector: 'app-selection-win-ticket', // Sélecteur du composant utilisé dans les templates HTML
  standalone: true, // Indique que le composant est autonome, ne dépendant d'aucun module spécifique
  imports: [
    TitleComponent, // Importation du composant pour afficher des titres
    ButtonComponent, // Importation du composant pour les boutons
    CommonModule, // Importation des fonctionnalités Angular de base (ngIf, ngFor, etc.)
    FormsModule, // Importation des fonctionnalités de gestion de formulaires Angular
  ],
  templateUrl: './selection-win-ticket.component.html', // Chemin vers le fichier template HTML
  styleUrl: './selection-win-ticket.component.css', // Chemin vers le fichier de style CSS
})
export class SelectionWinTicketComponent implements OnInit {
  // Déclaration des propriétés pour stocker les informations de la simulation
  totalParticipants!: number; // Nombre total de participants
  numberOfDraws!: number; // Nombre de tirages
  montantTotal!: number; // Montant total en jeu
  tirages: Tirage[] = []; // Tableau pour stocker les tirages

  constructor(
    private router: Router, // Injection du service `Router` pour la navigation
    private variableService: VariableService, // Injection du `VariableService` pour accéder aux limites de la grille et autres paramètres
  ) {}

  // `ngOnInit()` est une méthode appelée au moment de l'initialisation du composant
  ngOnInit(): void {
    // Récupérer les données de l'état précédent (via navigation)
    const state = history.state;

    this.totalParticipants = state.totalParticipants; // Récupération du nombre total de participants
    this.numberOfDraws = state.numberOfDraws; // Récupération du nombre de tirages
    this.montantTotal = state.montantTotal; // Récupération du montant total
    this.tirages = state.tirages; // Récupération de la liste des tirages précédents
  }

  // Générer un tirage gagnant aléatoire
  generateRandomTirageWin(): Tirage {
    const randomNumbers: number[] = []; // Tableau pour stocker les numéros aléatoires
    const randomStars: number[] = []; // Tableau pour stocker les étoiles aléatoires

    // Récupérer les limites des numéros et des étoiles via `VariableService`
    const maxNumberLimit = this.variableService.gridNumero; // Limite maximale pour les numéros (ex : 50)
    const maxStarLimit = this.variableService.gridEtoile; // Limite maximale pour les étoiles (ex : 12)

    // Générer 5 numéros uniques aléatoires dans la plage définie par `gridNumero`
    while (randomNumbers.length < this.variableService.selectionMaxNumber) {
      const randomNum = Math.floor(Math.random() * maxNumberLimit) + 1; // Génère un nombre entre 1 et maxNumberLimit
      if (!randomNumbers.includes(randomNum)) {
        randomNumbers.push(randomNum); // Ajoute le nombre au tableau s'il n'y est pas déjà
      }
    }

    // Générer 2 étoiles uniques aléatoires dans la plage définie par `gridEtoile`
    while (randomStars.length < this.variableService.selectionMaxStar) {
      const randomStar = Math.floor(Math.random() * maxStarLimit) + 1; // Génère un nombre entre 1 et maxStarLimit
      if (!randomStars.includes(randomStar)) {
        randomStars.push(randomStar); // Ajoute l'étoile au tableau si elle n'y est pas déjà
      }
    }

    // Retourne un objet `Tirage` contenant un pseudo vide et les numéros/étoiles générés
    return new Tirage('', randomNumbers, randomStars);
  }

  // Méthode pour générer un tirage gagnant aléatoire et rediriger vers la page des résultats
  goToRandomGeneration(): void {
    const randomTirageWin = this.generateRandomTirageWin(); // Appelle la fonction pour générer un tirage gagnant

    // Redirection vers la page des résultats de la simulation avec les données nécessaires
    this.router.navigate(['/resultat-simulation'], {
      state: {
        tirages: this.tirages, // Les tirages actuels
        totalParticipants: this.totalParticipants, // Nombre total de participants
        numberOfDraws: this.numberOfDraws, // Nombre de tirages
        montantTotal: this.montantTotal, // Montant total en jeu
        tirageWin: randomTirageWin, // Le tirage gagnant généré aléatoirement
      },
    });
  }

  // Méthode pour rediriger vers la saisie manuelle du ticket gagnant
  goToManualEntry(): void {
    // Redirection vers la page du formulaire de saisie manuelle avec les données nécessaires
    this.router.navigate(['/ticket-win-form'], {
      state: {
        totalParticipants: this.totalParticipants, // Nombre total de participants
        numberOfDraws: this.numberOfDraws, // Nombre de tirages
        montantTotal: this.montantTotal, // Montant total en jeu
        tirages: this.tirages, // Les tirages actuels à transférer
      },
    });
  }
}
