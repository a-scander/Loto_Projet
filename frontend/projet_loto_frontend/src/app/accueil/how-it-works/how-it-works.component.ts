import { Component, ElementRef, HostListener } from '@angular/core';
import { TitleComponent } from '../../ui_shared/title/title.component';
import { Router } from '@angular/router';
import { VariableService } from '../../services/variableservices/variable.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css',
})
export class HowItWorksComponent {
  constructor(
    private router: Router, // Injection du service Angular Router pour gérer la navigation entre les routes
    private el: ElementRef, // Injection de ElementRef pour accéder et manipuler le DOM
    private service: VariableService // Injection du service pour accéder aux variables partagées dans l'application
  ) {}

  // Propriétés récupérées à partir du service injecté
  numberTotalGrid: number = this.service.gridNumero; // Nombre total de numéros dans la grille
  starTotalGrid: number = this.service.gridEtoile; // Nombre total d'étoiles dans la grille
  sommeGain: number = this.service.sommeTirage; // Somme des gains du tirage
  nbParticipant : number = this.service.nbParticipant // Nombre de participants

  // Fonction pour rediriger vers une page spécifique
  navigateTo(route: string): void {
    this.router.navigate([route]); // Utilisation du service Router pour rediriger vers la route spécifiée
  }
  
  // Écoute l'événement de défilement de la fenêtre
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Sélectionne tous les éléments ayant la classe 'slide-in-right' pour les animer au défilement
    const elements = this.el.nativeElement.querySelectorAll('.slide-in-right');
    const windowHeight = window.innerHeight || document.documentElement.clientHeight; // Hauteur de la fenêtre

    // Parcourt chaque élément avec la classe 'slide-in-right'
    elements.forEach((element: any) => {
      const rect = element.getBoundingClientRect(); // Obtient la position de l'élément par rapport à la fenêtre

      // Vérifie si l'élément est suffisamment visible dans la fenêtre
      if (rect.top <= windowHeight - 100) {
        element.classList.add('visible'); // Ajoute la classe 'visible' pour déclencher l'animation
      }
    });
  }
  
}
