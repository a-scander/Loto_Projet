import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let mockRouter: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(), // Simulez la méthode navigate du Router
    } as unknown as Router;

    await TestBed.configureTestingModule({
      imports: [ConfirmationComponent], // Importez le composant autonome ici
      providers: [
        { provide: Router, useValue: mockRouter }, // Fournissez le mockRouter
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    navigateSpy = jest.spyOn(mockRouter, 'navigate');
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy(); // Vérifiez que le composant est créé avec succès
  });

  it('devrait initialiser le message par défaut', () => {
    expect(component.message).toBe('Confirmation par défaut.'); // Vérifiez le message par défaut
  });

  it("devrait rediriger vers l'accueil lorsque goToHome est appelé", () => {
    component.goToHome(); // Appelez la méthode
    expect(navigateSpy).toHaveBeenCalledWith(['/']); // Vérifiez que la méthode navigate a été appelée avec la bonne route
  });
});
