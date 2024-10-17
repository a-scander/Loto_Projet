import { Component, ElementRef, HostListener } from '@angular/core';
import { TitleComponent } from '../../ui_shared/title/title.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  constructor(private el: ElementRef) {}

// Écoute l'événement de défilement (scroll)
@HostListener('window:scroll', [])
onWindowScroll() {
    // Sélectionne l'élément avec la classe 'slide-in-left'
    const element = this.el.nativeElement.querySelector('.slide-in-left');

    // Obtient la position de l'élément par rapport à la fenêtre
    const rect = element.getBoundingClientRect();

    // Obtient la hauteur de la fenêtre
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Vérifie si l'élément est suffisamment visible dans la fenêtre
    if (rect.top <= windowHeight - 100) {
        // Ajoute la classe 'visible' pour déclencher l'animation
        element.classList.add('visible');
    }
}

}
