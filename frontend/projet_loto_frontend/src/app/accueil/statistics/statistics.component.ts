import { Component, HostListener, OnInit } from '@angular/core';
import { TitleComponent } from '../../ui_shared/title/title.component';

@Component({
  selector: 'app-statistics', // Sélecteur utilisé dans le template HTML
  standalone: true, // Ce composant est autonome et peut être utilisé seul
  imports: [TitleComponent], // Importe le composant TitleComponent
  templateUrl: './statistics.component.html', // Chemin vers le template HTML
  styleUrl: './statistics.component.css', // Chemin vers le fichier CSS associé
})
export class StatisticsComponent implements OnInit {
  // Valeurs initiales des statistiques (affichées au chargement)
  simulationsRapides = 0; // Nombre initial de simulations rapides
  simulationsPersonnalisees = 0; // Nombre initial de simulations personnalisées
  personnesInscrites = 0; // Nombre initial de personnes inscrites

  public statsAnimated = false; // Variable pour vérifier si les statistiques ont déjà été animées

  // Valeurs finales des statistiques à atteindre
  finalSimulationsRapides = 1000000; // 1 000 000 simulations rapides
  finalSimulationsPersonnalisees = 1500000; // 1 500 000 simulations personnalisées
  finalPersonnesInscrites = 50000; // Plus de 50 000 personnes inscrites

  constructor() {}

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    this.checkScroll(); // Vérifie si l'animation doit commencer dès le chargement
  }

  // Écouteur d'événement qui déclenche une action à chaque défilement de la fenêtre
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll(); // Vérifie si les statistiques doivent être animées au défilement
  }

  // Vérifie si l'utilisateur a défilé jusqu'à la section des statistiques
  public checkScroll(): void {
    const element = document.querySelector('.statistics') as HTMLElement; // Sélectionne l'élément de la section des statistiques
    const rect = element.getBoundingClientRect(); // Obtient la position de l'élément par rapport à la fenêtre
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight; // Hauteur de la fenêtre visible

    // Si la section des statistiques est visible dans la fenêtre et que l'animation n'a pas encore été déclenchée
    if (rect.top <= windowHeight - 100 && !this.statsAnimated) {
      this.statsAnimated = true; // Marque l'animation comme étant commencée
      this.animateStats(); // Démarre l'animation des statistiques
    }
  }

  // Démarre l'animation pour chaque statistique
  public animateStats(): void {
    this.animateValue('simulationsRapides', this.finalSimulationsRapides, 2000); // Anime le nombre de simulations rapides
    this.animateValue(
      'simulationsPersonnalisees',
      this.finalSimulationsPersonnalisees,
      2000,
    ); // Anime le nombre de simulations personnalisées
    this.animateValue('personnesInscrites', this.finalPersonnesInscrites, 2000); // Anime le nombre de personnes inscrites
  }

  // Méthode pour animer la valeur d'une statistique
  public animateValue(
    property: keyof StatisticsComponent, // Propriété de la classe à animer (simulationsRapides, simulationsPersonnalisees, personnesInscrites)
    finalValue: number, // Valeur finale à atteindre
    duration: number, // Durée totale de l'animation en millisecondes
  ): void {
    let startValue = 0; // Valeur initiale au début de l'animation
    const increment = Math.ceil(finalValue / (duration / 20)); // Calcule l'incrément pour chaque intervalle de 20ms

    // Lance un intervalle pour incrémenter progressivement la valeur
    const interval = setInterval(() => {
      if (startValue < finalValue) {
        (this[property] as number) = startValue; // Met à jour la valeur de la statistique en cours
        startValue += increment; // Augmente la valeur par l'incrément calculé
      } else {
        (this[property] as number) = finalValue; // Une fois la valeur finale atteinte, on s'assure que c'est bien cette valeur qui est affichée
        clearInterval(interval); // Arrête l'intervalle une fois l'animation terminée
      }
    }, 20); // L'intervalle est défini pour s'exécuter toutes les 20ms
  }
}
