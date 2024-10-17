// Importation des modules nécessaires
import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component'; // Importation du composant bouton personnalisé
import { Router } from '@angular/router';

// Déclaration du composant
@Component({
  selector: 'app-confirmation', // Sélecteur utilisé pour insérer ce composant dans les templates HTML
  standalone: true, // Ce composant est autonome et ne nécessite pas de module spécifique pour être utilisé
  imports: [ButtonComponent], // Importation des composants enfants, ici le bouton
  templateUrl: './confirmation.component.html', // Chemin vers le fichier HTML du template associé
  styleUrl: './confirmation.component.css', // Chemin vers le fichier CSS contenant les styles associés
})

// Classe principale pour le composant de confirmation
export class ConfirmationComponent {
  // Propriété d'entrée (Input) qui permet de recevoir un message personnalisé
  @Input() message: string = 'Confirmation par défaut.'; // Message par défaut en cas d'absence d'input

  // Constructeur pour injecter le service de navigation
  constructor(private router: Router) {}

  // Fonction pour rediriger l'utilisateur vers la page d'accueil
  goToHome(): void {
    this.router.navigate(['/']); // Utilise le routeur Angular pour naviguer vers la racine (page d'accueil)
  }
}
