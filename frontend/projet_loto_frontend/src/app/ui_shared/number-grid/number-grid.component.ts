import { CommonModule } from '@angular/common'; // Import du module commun d'Angular pour utiliser des directives de base
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'; // Import des décorateurs et interfaces d'Angular pour créer des composants et gérer les entrées/sorties
import { VariableService } from '../../services/variableservices/variable.service'; // Service pour accéder aux variables globales de configuration
import { ButtonComponent } from '../button/button.component'; // Import du composant bouton partagé

@Component({
  selector: 'app-number-grid', // Sélecteur du composant, utilisé dans les templates HTML pour insérer ce composant
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule, ButtonComponent], // Modules et composants importés utilisés dans le template
  templateUrl: './number-grid.component.html', // Chemin vers le fichier template HTML
  styleUrl: './number-grid.component.css', // Chemin vers le fichier de style CSS
})
export class NumberGridComponent implements OnInit {
  @Input() maxSelections!: number; // Nombre maximum de numéros que l'utilisateur peut sélectionner
  @Output() selectionConfirmed = new EventEmitter<number[]>(); // Émet les numéros sélectionnés après confirmation
  @Input() type!: string; // Type de grille, peut être 'numero' ou 'star'
  @Input() selectedNumbers: number[] = []; // Tableau des numéros déjà sélectionnés

  gridNumbers: number[] = []; // Tableau pour stocker les numéros de la grille

  constructor(private variableService: VariableService) {} // Injection du service `VariableService` pour accéder aux variables globales

  ngOnInit(): void {
    let size!: number; // Variable pour stocker la taille de la grille
    if (this.type === 'star') {
      size = this.variableService.gridEtoile; // Récupérer la taille de la grille des étoiles
    } else if (this.type === 'numero') {
      size = this.variableService.gridNumero; // Récupérer la taille de la grille des numéros
    }
    // Remplir le tableau `gridNumbers` avec les numéros de 1 à `size`
    this.gridNumbers = Array.from({ length: size }, (_, i) => i + 1);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedNumbers']) {
      // Mise à jour des numéros sélectionnés lors des changements
      this.selectedNumbers = [...changes['selectedNumbers'].currentValue];
    }
  }
  // Méthode pour sélectionner ou désélectionner un numéro
  selectNumber(number: number): void {
    if (this.selectedNumbers.includes(number)) {
      // Si le numéro est déjà sélectionné, le désélectionner
      this.selectedNumbers = this.selectedNumbers.filter((n) => n !== number);
    } else if (this.selectedNumbers.length < this.maxSelections) {
      // Ajouter le numéro si la sélection est inférieure au maximum autorisé
      this.selectedNumbers.push(number);
    }
  }

  // Méthode pour diviser un tableau en sous-tableaux
  chunkArray(array: number[]): number[][] {
    const result = []; // Tableau pour stocker les sous-tableaux
    // Itérer sur l'array pour le diviser en chunks
    for (let i = 0; i < array.length; i += this.variableService.printRangGrid) {
      result.push(array.slice(i, i + this.variableService.printRangGrid)); // Ajouter le chunk au résultat
    }
    return result; // Retourner le tableau des sous-tableaux
  }

  // Méthode pour confirmer la sélection et émettre les numéros
  confirmSelection(): void {
    this.selectionConfirmed.emit(this.selectedNumbers); // Émet les numéros sélectionnés via l'événement `selectionConfirmed`
  }
}
