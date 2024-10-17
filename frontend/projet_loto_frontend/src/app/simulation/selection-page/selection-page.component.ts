import { Component } from '@angular/core'; // Import de la classe `Component` d'Angular
import { Router } from '@angular/router'; // Import du service `Router` pour la navigation
import { TitleComponent } from '../../ui_shared/title/title.component'; // Import du composant `TitleComponent` utilisé pour afficher un titre partagé
import { VariableService } from '../../services/variableservices/variable.service';

@Component({
  selector: 'app-selection-page', // Sélecteur du composant, utilisé pour insérer ce composant dans le template HTML
  standalone: true, // Indique que le composant est autonome, sans dépendance explicite à un module
  imports: [TitleComponent], // Le composant utilise `TitleComponent` dans son template
  templateUrl: './selection-page.component.html', // Lien vers le fichier template HTML
  styleUrl: './selection-page.component.css', // Lien vers le fichier de styles CSS
})
export class SelectionPageComponent {
  constructor(
    private router: Router, // Injection du service `Router` pour permettre la navigation entre les différentes pages de l'application.
    private service: VariableService, // Injection du service `VariableService` pour accéder et manipuler des variables ou configurations partagées à travers l'application.
  ) {}

  numberTotalGrid: number = this.service.gridNumero; // Nombre total de numéros dans la grille
  starTotalGrid: number = this.service.gridEtoile; // Nombre total d'étoiles dans la grille
  // Méthode pour rediriger l'utilisateur vers la page de simulation rapide
  goToQuickSimulation(): void {
    this.router.navigate(['/quick-simulation']); // Utilisation de la méthode `navigate` du service `Router` pour changer de route
  }

  // Méthode pour rediriger l'utilisateur vers la page de simulation personnalisée
  goToCustomSimulation(): void {
    this.router.navigate(['/custom-form']); // Redirection vers la page du formulaire de simulation personnalisée
  }
}
