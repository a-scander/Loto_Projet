import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../ui_shared/button/button.component';
import { CommonModule } from '@angular/common';
import { VariableBinding } from '@angular/compiler';
import { VariableService } from '../../services/variableservices/variable.service';

@Component({
  selector: 'app-custom-form', // Sélecteur utilisé pour insérer ce composant dans les templates
  standalone: true, // Le composant peut être utilisé de manière autonome (sans être lié à un module spécifique)
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule], // Importation des modules et composants nécessaires
  templateUrl: './custom-form.component.html', // Fichier HTML pour le template du composant
  styleUrl: './custom-form.component.css', // Fichier CSS pour le style du composant
})
export class CustomFormComponent {
  customForm: FormGroup; // Déclaration du groupe de formulaire réactif
  totalParticipant : number = this.service.nbParticipant; // récuperation du nombre de participants
  sizeMax : number = this.service.sizeMax; // récuperation du montant Max
  constructor(
    private fb: FormBuilder, // Injection du FormBuilder pour créer et gérer le formulaire
    private router: Router, // Injection du Router pour la navigation entre les pages
    private service :VariableService,//Injection du Service Variable pour récupérer des valeurs globales
  ) {
    // Création du formulaire réactif avec ses contrôles et leurs validations
    this.customForm = this.fb.group(
      {
        totalParticipants: [
          null, // Valeur initiale
          [Validators.required, Validators.min(0), Validators.max(this.totalParticipant)], // Validations : requis, entre 0 et 100
        ],
        numberOfDraws: [null, [Validators.required, Validators.min(0)]], // Validations : requis, supérieur ou égal à 0
        montantTotal: [null, [Validators.required, this.gainValidator()]], // Validation : requis et validateur personnalisé pour le gain
      },
      {
        validators: this.validateDrawsLessThanParticipants, // Validation croisée personnalisée pour vérifier la relation entre deux champs
      },
    );
  }

  // Validation croisée pour s'assurer que le nombre de tirages est <= au nombre de participants
  validateDrawsLessThanParticipants(group: FormGroup) {
    const totalParticipants =
      parseInt(group.get('totalParticipants')?.value, 10) || 0; // Récupère et parse la valeur du champ totalParticipants
    const numberOfDraws = parseInt(group.get('numberOfDraws')?.value, 10) || 0; // Récupère et parse la valeur du champ numberOfDraws
    // Si le nombre de tirages est supérieur au nombre de participants, retourne une erreur, sinon null
    return numberOfDraws <= totalParticipants
      ? null
      : { drawsExceedParticipants: true };
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    if (this.customForm.valid) {
      const formData = this.customForm.value; // Récupère les données du formulaire si valide

      // Navigation vers la page "enter-ticket" avec les données du formulaire dans l'état
      this.router.navigate(['/enter-ticket'], {
        state: {
          totalParticipants: formData.totalParticipants,
          numberOfDraws: formData.numberOfDraws,
          montantTotal: formData.montantTotal,
        },
      });
    }
  }

  // Validation du champ pour empêcher l'entrée de tout autre caractère que les chiffres
  validateNumberInput(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', // Autorise la suppression
      'ArrowLeft', // Autorise la navigation avec les flèches
      'ArrowRight',
      'Tab', // Autorise la navigation avec la touche Tab
      'Delete', // Autorise la suppression
    ];
    // Bloque les touches non numériques sauf si elles font partie des touches autorisées
    if (!allowedKeys.includes(event.key) && !/^\d+$/.test(event.key)) {
      event.preventDefault(); // Empêche la saisie de caractères non autorisés
    }
  }

  // Validator personnalisé pour vérifier que le gain total est supérieur à 0 et ne dépasse pas 999,999,999,999
  gainValidator() {
    return (control: AbstractControl) => {
      const value = parseFloat(control.value); // Conversion de la valeur en nombre
      if (isNaN(value)) {
        return { invalidGain: true }; // Retourne une erreur si la valeur n'est pas un nombre valide
      }
      if (value <= 0) {
        return { invalidGain: true }; // Retourne une erreur si la valeur est <= 0
      }
      if (value > this.sizeMax) {
        return { gainTooHigh: true }; // Retourne une erreur si la valeur dépasse 999,999,999,999
      }
      return null;
    };
  }

  // Validation du champ pour les nombres décimaux avec un seul point et une limite maximale
  validateDecimalInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Vérifier si la touche est une lettre, un caractère non numérique, ou une saisie de point inutile
    const allowedKeys = [
      'Backspace', // Autorise la suppression
      'ArrowLeft', // Autorise la navigation avec les flèches
      'ArrowRight',
      'Tab', // Autorise la navigation avec la touche Tab
      'Delete', // Autorise la suppression
    ];

    // Bloque tout caractère non numérique et non point décimal
    if (
      !allowedKeys.includes(event.key) &&
      !/^\d+$/.test(event.key) &&
      event.key !== '.'
    ) {
      event.preventDefault(); // Empêche la saisie de caractères non autorisés
    }

    // Empêche la saisie d'un second point décimal ou d'un point au début
    if (
      event.key === '.' &&
      (input.value.includes('.') || input.value === '')
    ) {
      event.preventDefault(); // Empêche la saisie si la valeur contient déjà un point
    }
  }
}
