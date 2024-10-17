import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormComponent } from './custom-form.component';
import { ButtonComponent } from '../../ui_shared/button/button.component';
import { CommonModule } from '@angular/common';

describe('CustomFormComponent', () => {
  let component: CustomFormComponent;
  let fixture: ComponentFixture<CustomFormComponent>;
  let router: Router;

  beforeEach(() => {
    const routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ButtonComponent,
        CommonModule,
        CustomFormComponent, // Ajouté ici dans les imports, car c'est un composant standalone
      ],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait rendre le formulaire invalide si les champs ne sont pas remplis', () => {
    expect(component.customForm.valid).toBeFalsy(); // Le formulaire ne doit pas être valide au départ
  });

  it('devrait valider correctement les champs lorsque les données sont valides', () => {
    component.customForm.controls['totalParticipants'].setValue(50);
    component.customForm.controls['numberOfDraws'].setValue(10);
    component.customForm.controls['montantTotal'].setValue(1000);

    expect(component.customForm.valid).toBeTruthy(); // Le formulaire doit être valide
  });

  it('devrait rendre le formulaire invalide si le nombre de tirages dépasse le nombre de participants', () => {
    component.customForm.controls['totalParticipants'].setValue(10);
    component.customForm.controls['numberOfDraws'].setValue(15); // Tirages > Participants
    component.customForm.controls['montantTotal'].setValue(500);

    expect(component.customForm.valid).toBeFalsy();
    expect(component.customForm.errors).toEqual({
      drawsExceedParticipants: true,
    });
  });

  it('devrait bloquer la soumission si le formulaire est invalide', () => {
    component.customForm.controls['totalParticipants'].setValue(50);
    component.customForm.controls['numberOfDraws'].setValue(60); // Invalid scenario
    component.customForm.controls['montantTotal'].setValue(0); // Invalid montant

    component.onSubmit();

    expect(router.navigate).not.toHaveBeenCalled(); // Ne pas rediriger si le formulaire est invalide
  });

  it('devrait rediriger avec les données correctes lorsque le formulaire est valide', () => {
    component.customForm.controls['totalParticipants'].setValue(50);
    component.customForm.controls['numberOfDraws'].setValue(10);
    component.customForm.controls['montantTotal'].setValue(500);

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/enter-ticket'], {
      state: {
        totalParticipants: 50,
        numberOfDraws: 10,
        montantTotal: 500,
      },
    });
  });

  it('devrait bloquer les caractères non numériques dans les champs de type nombre', () => {
    const event = {
      key: 'a',
      preventDefault: jest.fn(),
    } as unknown as KeyboardEvent;

    component.validateNumberInput(event);

    expect(event.preventDefault).toHaveBeenCalled(); // Appelé car 'a' n'est pas autorisé
  });

  it('devrait autoriser les caractères numériques dans les champs de type nombre', () => {
    const event = {
      key: '1',
      preventDefault: jest.fn(),
    } as unknown as KeyboardEvent;

    component.validateNumberInput(event);

    expect(event.preventDefault).not.toHaveBeenCalled(); // Non appelé car '1' est un chiffre
  });

  it('devrait bloquer plusieurs points dans les champs décimaux', () => {
    const inputElement = { value: '123.4' } as HTMLInputElement;
    const event = {
      key: '.',
      preventDefault: jest.fn(),
      target: inputElement,
    } as unknown as KeyboardEvent;

    component.validateDecimalInput(event);

    expect(event.preventDefault).toHaveBeenCalled(); // Le deuxième point (.) est bloqué
  });
});
