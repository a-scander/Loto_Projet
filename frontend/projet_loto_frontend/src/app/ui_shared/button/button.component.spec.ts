import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let mockClickHandler: jest.Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent], // Importez le composant autonome ici
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    mockClickHandler = jest.fn(); // Simule un gestionnaire de clic
    component.clicked.subscribe(mockClickHandler); // Abonnez-vous à l'événement clicked
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy(); // Vérifie que le composant est créé avec succès
  });

  it("devrait lever une erreur si le label n'est pas fourni", () => {
    component.label = ''; // Mettre à vide pour tester
    expect(() => component.ngOnInit()).toThrowError(
      "L'input `label` est requis pour le composant `ButtonComponent`.",
    );
  });

  it('devrait émettre un événement clicked lorsque le bouton est cliqué', () => {
    component.label = 'Test Button'; // Assurez-vous que le label est défini
    fixture.detectChanges(); // Déclenche le cycle de détection des modifications

    component.onClick(); // Simulez le clic sur le bouton
    expect(mockClickHandler).toHaveBeenCalled(); // Vérifiez que l'événement a été émis
  });

  it('ne devrait pas émettre un événement clicked lorsque le bouton est désactivé', () => {
    component.label = 'Test Button'; // Assurez-vous que le label est défini
    component.disabled = true; // Désactivez le bouton
    fixture.detectChanges(); // Déclenche le cycle de détection des modifications

    component.onClick(); // Simulez le clic sur le bouton
    expect(mockClickHandler).not.toHaveBeenCalled(); // Vérifiez que l'événement n'a pas été émis
  });
});
