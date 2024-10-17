import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SelectionPageComponent } from './selection-page.component';

describe('SelectionPageComponent', () => {
  let component: SelectionPageComponent;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectionPageComponent], // On utilise `SelectionPageComponent` comme composant autonome
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(), // On crée un spy avec Jest sur la méthode `navigate` de `Router`
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(SelectionPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // On récupère le service Router injecté
    navigateSpy = router.navigate as unknown as jest.SpyInstance; // On stocke le spy de la méthode `navigate`
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy(); // Vérifie que le composant est bien créé
  });

  it('devrait rediriger vers /quick-simulation lors de l\'appel de goToQuickSimulation', () => {
    component.goToQuickSimulation(); // Appelle la méthode de redirection
    expect(navigateSpy).toHaveBeenCalledWith(['/quick-simulation']); // Vérifie que `navigate` a été appelée avec la route correcte
  });

  it('devrait rediriger vers /custom-form lors de l\'appel de goToCustomSimulation', () => {
    component.goToCustomSimulation(); // Appelle la méthode de redirection
    expect(navigateSpy).toHaveBeenCalledWith(['/custom-form']); // Vérifie que `navigate` a été appelée avec la bonne route
  });
});
