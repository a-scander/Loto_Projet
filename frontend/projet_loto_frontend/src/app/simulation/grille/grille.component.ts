import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TitleComponent } from '../../ui_shared/title/title.component';
import { Tirage } from '../../models/tirage-model';
import { ButtonComponent } from '../../ui_shared/button/button.component';

@Component({
  selector: 'app-grille',
  standalone: true,
  imports: [CommonModule,TitleComponent,ButtonComponent],
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.css']
})
export class GrilleComponent {
  // Inputs to get total number of participants and number of draws from the parent component
  @Input() totalParticipants!: number;
  @Input() numberOfDraws!: number;
  @Output() tiragesByUser = new EventEmitter<Tirage[]>(); // Declare the output event

  // Constants for maximum numbers and stars
  maxNumeros: number = 49; // Maximum numbers available to select
  maxEtoiles: number = 9;  // Maximum stars available to select

  // Constants for the required selection
  readonly maxNumerosSelection: number = 5; // Number of numbers to be selected
  readonly maxEtoilesSelection: number = 2; // Number of stars to be selected

  // Arrays to store numbers and stars for selection
  numeros: number[] = Array.from({ length: this.maxNumeros }, (_, i) => i + 1); // [1, 2, ..., 49]
  etoiles: number[] = Array.from({ length: this.maxEtoiles }, (_, i) => i + 1); // [1, 2, ..., 9]

  // Arrays to store the selected numbers and stars
  selectedNumeros: number[] = [];
  selectedEtoiles: number[] = [];

  currentIndex: number = 0; // Index of the current draw
  tirages: Tirage[] = []; 
  
  
   getRows(array: number[], itemsPerRow: number): number[][] {
    const rows = [];
    for (let i = 0; i < array.length; i += itemsPerRow) {
      rows.push(array.slice(i, i + itemsPerRow));
    }
    return rows;
  }

  // Method to toggle the selection of a number
  toggleNumeroSelection(numero: number): void {
    if (this.selectedNumeros.includes(numero)) {
      this.selectedNumeros = this.selectedNumeros.filter(n => n !== numero);
    } else if (this.selectedNumeros.length < this.maxNumerosSelection) {
      this.selectedNumeros.push(numero);
    }
  }

  // Method to toggle the selection of a star
  toggleEtoileSelection(etoile: number): void {
    if (this.selectedEtoiles.includes(etoile)) {
      this.selectedEtoiles = this.selectedEtoiles.filter(e => e !== etoile);
    } else if (this.selectedEtoiles.length < this.maxEtoilesSelection) {
      this.selectedEtoiles.push(etoile);
    }
  }

  // Method to check if a number is selected
  isNumeroSelected(numero: number): boolean {
    return this.selectedNumeros.includes(numero);
  }

  // Method to check if a star is selected
  isEtoileSelected(etoile: number): boolean {
    return this.selectedEtoiles.includes(etoile);
  }

  get isFirstDraw(): boolean {
    return this.currentIndex === 0;
  }

  get isLastDraw(): boolean {
    return this.currentIndex === this.numberOfDraws - 1;
  }

  get isSelectionValid(): boolean {
    return this.selectedNumeros.length === this.maxNumerosSelection && 
           this.selectedEtoiles.length === this.maxEtoilesSelection;
  }
   // Method to validate the current selection and create a draw
   validateSelection(): void {
    if (this.isSelectionValid) {
      const nouveauTirage = new Tirage([...this.selectedNumeros], [...this.selectedEtoiles]);
      this.tirages[this.currentIndex] = nouveauTirage;
      console.log('Nouveau tirage ajouté : ', nouveauTirage);
      this.resetSelection(); // Reset selection after validation
     this.sendTirage();
    }
  }
  sendTirage(): void {
    this.tiragesByUser.emit(this.tirages);
  }

  // Method to reset the selection after validation
  resetSelection(): void {
    this.selectedNumeros = [];
    this.selectedEtoiles = [];
  }

 // Method to go to the next draw
 nextDraw(): void {
  if (this.isSelectionValid) {
    this.validateSelection();
    if (!this.isLastDraw) {
      this.currentIndex++;
      this.loadSelection();
    }
  }
}

// Method to go to the previous draw
previousDraw(): void {
  if (!this.isFirstDraw) {
    this.validateSelection();
    this.currentIndex--;
    this.loadSelection();
  }
}

// Method to load an existing selection if one has been made
loadSelection(): void {
  const currentTirage = this.tirages[this.currentIndex];
  if (currentTirage) {
    this.selectedNumeros = [...currentTirage.numeros];
    this.selectedEtoiles = [...currentTirage.etoiles];
  } else {
    this.resetSelection();
  }
}

get titleNumeroText(): string {
  return `Grille des numéros (Sélectionnez ${this.maxNumerosSelection} numéros)`;
}

get titleEtoileText(): string {
  return `Grille des numéros (Sélectionnez ${this.maxNumerosSelection} numéros)`;
}

get titleIndexText(): string {
  return ` ${this.currentIndex + 1}/${this.numberOfDraws}`;
}
}
