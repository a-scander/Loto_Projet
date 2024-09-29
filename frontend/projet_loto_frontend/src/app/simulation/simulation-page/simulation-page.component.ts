import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimulationFormulaireComponent } from '../simulation-formulaire/simulation-formulaire.component';
import { GrilleComponent } from '../grille/grille.component';
import { Tirage } from '../../models/tirage-model';
import { RecapTableauComponent } from "../recap-tableau/recap-tableau.component";

@Component({
  selector: 'app-simulation-page',
  standalone: true,
  imports: [
    CommonModule, SimulationFormulaireComponent, GrilleComponent,
    RecapTableauComponent
],
  templateUrl: './simulation-page.component.html',
  styleUrls: ['./simulation-page.component.css']
})
export class SimulationPageComponent implements OnInit {
  totalParticipants!: number; // Nombre total de participants
  numberOfDraws!: number; // Nombre de tirages à effectuer
  drawType!: string; // Type de tirage (auto ou manuel)
  formSubmitted: boolean = false;
  tirages: Tirage[] = []; // Stocker les tirages reçus
  tiragesCompleted: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  onFormSubmit(formValue: { totalParticipants: number, numberOfDraws: number, drawType: string }): void {
    this.totalParticipants = formValue.totalParticipants;
    this.numberOfDraws = formValue.numberOfDraws;
    this.drawType = formValue.drawType;
    this.formSubmitted = true;
  }

  onTirage(tirages: Tirage[]): void {
    this.tiragesCompleted = true;
    this.tirages = tirages; // Stocke le tableau de tirages reçu du composant enfant
   
  }
}
