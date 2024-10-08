import { Component, Input } from '@angular/core';
import { Tirage } from '../../models/tirage-model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui_shared/button/button.component';

@Component({
  selector: 'app-animation-loterie',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './animation-loterie.component.html',
  styleUrl: './animation-loterie.component.css',
})
export class AnimationLoterieComponent {
  @Input() winningTirage!: Tirage; // Le tirage gagnant avec numéros et étoiles
  displayNumbers: number[] = [0, 0, 0, 0, 0]; // Pour afficher les numéros (au début à 0)
  displayStars: number[] = [0, 0]; // Pour afficher les étoiles (au début à 0)
  animationRunning: boolean = false;

  // Démarrer l'animation
  startLottery(): void {
    if (this.animationRunning || !this.winningTirage) return; // Si l'animation est déjà en cours ou si le tirage est vide

    this.animationRunning = true;
    let iteration = 0;
    const totalIterations = 20; // Nombre total d'itérations pour l'animation

    const interval = setInterval(() => {
      this.displayNumbers = this.generateRandomNumbers(); // Générer des numéros aléatoires pendant l'animation
      this.displayStars = this.generateRandomStars(); // Générer des étoiles aléatoires pendant l'animation
      iteration++;

      if (iteration >= totalIterations) {
        clearInterval(interval); // Arrêter l'animation
        this.displayNumbers = [...this.winningTirage.numeros]; // Afficher les numéros gagnants
        this.displayStars = [...this.winningTirage.etoiles]; // Afficher les étoiles gagnantes
        this.animationRunning = false; // Animation terminée
      }
    }, 100); // Intervalle rapide au début
  }

  // Générer des numéros aléatoires pour l'animation
  generateRandomNumbers(): number[] {
    const randomNumbers: number[] = [];
    while (randomNumbers.length < 5) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }
    return randomNumbers;
  }

  // Générer des étoiles aléatoires pour l'animation
  generateRandomStars(): number[] {
    const randomStars: number[] = [];
    while (randomStars.length < 2) {
      const star = Math.floor(Math.random() * 9) + 1;
      if (!randomStars.includes(star)) {
        randomStars.push(star);
      }
    }
    return randomStars;
  }
}
