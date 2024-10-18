import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Le service est disponible à l'échelle de l'application
})
export class VariableService {
  // Déclaration des variables privées avec des valeurs par défaut
  private _sommeTirage: number = 3000000; // Montant total à distribuer dans un tirage
  private _gridNumero: number = 49; // Taille de la grille de numéros (1 à 49)
  private _gridEtoile: number = 9; // Taille de la grille d'étoiles (1 à 9)
  private _printRangGrid: number = 10; // Nombre d'éléments par rangée dans une grille
  private _selectionMaxNumber: number = 5; // Nombre maximum de numéros à sélectionner
  private _selectionMaxStar: number = 2; // Nombre maximum d'étoiles à sélectionner
  private _nbParticipants: number = 100; // Nombre de participants dans un tirage
  private _numberOfDraws: number = 1; // Nombre de tirages
  private _sizeMax: number = 999999999999; // Montant Max Total

  // Getter pour récupérer la valeur de la somme du tirage
  get sommeTirage(): number {
    return this._sommeTirage;
  }

   // Getter pour récupérer la valeur de la somme du tirage
   get sizeMax(): number {
    return this._sizeMax;
  }

  // Getter pour récupérer le nombre de participants
  get nbParticipant(): number {
    return this._nbParticipants;
  }

  // Getter pour récupérer le nombre de tirages
  get numberOfDraws(): number {
    return this._numberOfDraws;
  }

  // Setter pour modifier la somme du tirage (seulement si elle est positive)
  set sommeTirage(value: number) {
    if (value >= 0) {
      this._sommeTirage = value;
    } else {
      console.warn('La somme du tirage ne peut pas être négative');
    }
  }

  // Getter pour récupérer la taille de la grille des numéros
  get gridNumero(): number {
    return this._gridNumero;
  }

  // Getter pour récupérer la taille de la grille des étoiles
  get gridEtoile(): number {
    return this._gridEtoile;
  }

  // Getter pour récupérer le nombre maximum d'étoiles sélectionnables
  get selectionMaxStar(): number {
    return this._selectionMaxStar;
  }

  // Getter pour récupérer le nombre maximum de numéros sélectionnables
  get selectionMaxNumber(): number {
    return this._selectionMaxNumber;
  }

  // Getter pour récupérer le nombre d'éléments par rangée dans une grille
  get printRangGrid(): number {
    return this._printRangGrid;
  }

  // Setter pour modifier le nombre d'éléments par rangée dans la grille (doit être supérieur à 0)
  set printRangGrid(value: number) {
    if (value > 0) {
      this._printRangGrid = value;
    } else {
      console.warn(
        "Le nombre d'éléments par rangée de la grille doit être supérieur à 0",
      );
    }
  }
}
