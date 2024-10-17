import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BannerComponent } from '../banner/banner.component';
import { AboutComponent } from '../about/about.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { StatisticsComponent } from '../statistics/statistics.component';

@Component({
  selector: 'app-accueil-page',
  standalone: true,
  imports: [
    BannerComponent,
    AboutComponent,
    HowItWorksComponent,
    StatisticsComponent,
  ],
  templateUrl: './accueil-page.component.html',
  styleUrl: './accueil-page.component.css',
})
export class AccueilPageComponent {
  constructor(private router: Router) {}

  // Redirige vers la page de simulation en utilisant le routeur Angular
  startSimulation(): void {
    this.router.navigate(['/simulation']); // Navigue vers la route '/simulation'
  }

  // Redirige vers la page de l'historique des tirages
  goToHistory(): void {
    this.router.navigate(['/historique']); // Navigue vers la route '/historique'
  }
}
