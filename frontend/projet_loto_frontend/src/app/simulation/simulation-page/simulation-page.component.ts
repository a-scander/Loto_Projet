import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimulationFormulaireComponent } from '../simulation-formulaire/simulation-formulaire.component';
import { GrilleComponent } from '../grille/grille.component';
import { Tirage } from '../../models/tirage-model';
import { RecapTableauComponent } from '../recap-tableau/recap-tableau.component';
import { TirageGagnantComponent } from '../tirage-gagnant/tirage-gagnant.component';
import { AnimationLoterieComponent } from '../animation-loterie/animation-loterie.component';
import { TirageService } from '../../services/services/tirage.service';
import { ClassementTirageComponent } from '../classement-tirage/classement-tirage.component';

@Component({
  selector: 'app-simulation-page',
  standalone: true,
  imports: [
    CommonModule,
    SimulationFormulaireComponent,
    GrilleComponent,
    RecapTableauComponent,
    TirageGagnantComponent,
    AnimationLoterieComponent,
    ClassementTirageComponent,
  ],
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.css'],
})
export class SimulationPageComponent implements OnInit {
  totalParticipants!: number; // Nombre total de participants
  numberOfDraws!: number; // Nombre de tirages à effectuer
  tirageWin!: Tirage;
  formSubmitted: boolean = false;
  tirages: Tirage[] = []; // Stocker les tirages reçus
  indexHide: number = 0;
  classement: Tirage[] = []; // Tirages classés
  position!: number[];
  gains!: number[];

  constructor(private tirageService: TirageService) {}

  ngOnInit(): void {}

  onFormSubmit(formValue: {
    totalParticipants: number;
    numberOfDraws: number;
  }): void {
    this.totalParticipants = formValue.totalParticipants;
    this.numberOfDraws = formValue.numberOfDraws;
    this.formSubmitted = true;
  }

  onTirage(tirages: Tirage[]): void {
    this.tirages = tirages;
  }

  indexHideSend(index: number): void {
    this.indexHide = index;
  }

  winningTirageSelected(tirage: Tirage): void {
    this.tirageWin = tirage;

    // Appel à la nouvelle méthode qui combine classement, positions et gains
    this.tirageService
      .classerTiragesEtCalculerGains(this.tirages, this.tirageWin)
      .subscribe(
        (response) => {
          debugger;
          // La réponse contient le classement, les positions et les gains
          this.classement = response.classement;
          this.position = response.positions;
          this.gains = response.gains;
          console.log('Classement:', this.classement);
          console.log('Positions:', this.position);
          console.log('Gains:', this.gains);
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des données combinées:',
            error,
          );
        },
      );
  }
}
