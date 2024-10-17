import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../ui_shared/button/button.component';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent implements OnInit {
  constructor(private router: Router) {}
  // Injection du service Router pour gérer la navigation entre les routes de l'application

  ngOnInit(): void {}
  // Méthode du cycle de vie d'Angular, appelée lors de l'initialisation du composant

  // Méthode déclenchée lors du clic sur un bouton
  onButtonClick(): void {
    this.router.navigate(['/simulation']);
    // Utilise le routeur pour rediriger l'utilisateur vers la page de simulation
  }
}
