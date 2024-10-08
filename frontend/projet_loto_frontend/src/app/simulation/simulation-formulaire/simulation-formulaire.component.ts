import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-simulation-formulaire',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './simulation-formulaire.component.html',
  styleUrl: './simulation-formulaire.component.css',
})
export class SimulationFormulaireComponent implements OnInit {
  simulationForm!: FormGroup;
  @Output() formSubmitted = new EventEmitter<{
    totalParticipants: number;
    numberOfDraws: number;
  }>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Initialisation du formulaire avec `numberOfDraws` désactivé
    this.simulationForm = this.formBuilder.group({
      totalParticipants: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      numberOfDraws: [
        { value: null, disabled: true },
        [Validators.required, Validators.min(1)],
      ],
    });

    // Appel de la méthode pour gérer les changements sur `totalParticipants`
    this.TotalParticipantsChanges();
  }

  // Méthode séparée pour gérer les changements du champ `totalParticipants`
  TotalParticipantsChanges(): void {
    this.simulationForm
      .get('totalParticipants')
      ?.valueChanges.subscribe((value) => {
        const numberOfDrawsControl = this.simulationForm.get('numberOfDraws');

        // Si `totalParticipants` est valide, activer `numberOfDraws` et ajuster les validateurs
        if (this.simulationForm.get('totalParticipants')?.valid) {
          numberOfDrawsControl?.enable();
          numberOfDrawsControl?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(value),
          ]);
        } else {
          // Si `totalParticipants` est invalide, désactiver `numberOfDraws`
          numberOfDrawsControl?.disable();
        }

        // Mettre à jour la validité de `numberOfDraws`
        numberOfDrawsControl?.updateValueAndValidity();
      });
  }
  // Empêche la saisie du signe "-" , "+" , "." et ","
  validateInput(event: KeyboardEvent) {
    if (
      event.key === '-' ||
      event.key === '+' ||
      event.key === '.' ||
      event.key === ','
    ) {
      event.preventDefault();
    }
  }
  onSubmit(): void {
    if (this.simulationForm.valid) {
      this.formSubmitted.emit(this.simulationForm.value);
    }
  }
}
