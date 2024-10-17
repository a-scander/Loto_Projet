import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SelectionWinTicketComponent } from './selection-win-ticket.component';
import { VariableService } from '../../services/variableservices/variable.service';
import { Tirage } from '../../models/tirage-model';

describe('SelectionWinTicketComponent', () => {
  let component: SelectionWinTicketComponent;
  let fixture: ComponentFixture<SelectionWinTicketComponent>;
  let mockRouter: Router;
  let mockVariableService: VariableService;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockVariableService = {
      gridNumero: 50,
      gridEtoile: 12,
      selectionMaxNumber: 5,
      selectionMaxStar: 2,
    } as VariableService;

    await TestBed.configureTestingModule({
      imports: [SelectionWinTicketComponent], // Utilisation du composant autonome
      providers: [
        { provide: VariableService, useValue: mockVariableService },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(), // Spy sur la méthode `navigate`
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionWinTicketComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    navigateSpy = jest.spyOn(mockRouter, 'navigate');
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy(); // Vérifie que le composant est bien créé
  });

  it("devrait initialiser avec les données de l'état", () => {
    const mockState = {
      totalParticipants: 10,
      numberOfDraws: 5,
      montantTotal: 1000,
      tirages: [new Tirage('Joueur1', [1, 2, 3, 4, 5], [1, 2])],
    };

    history.pushState(mockState, '');

    component.ngOnInit();

    expect(component.totalParticipants).toBe(mockState.totalParticipants);
    expect(component.numberOfDraws).toBe(mockState.numberOfDraws);
    expect(component.montantTotal).toBe(mockState.montantTotal);
    expect(component.tirages).toEqual(mockState.tirages);
  });

  it('devrait générer un tirage gagnant aléatoire', () => {
    const randomTirage = component.generateRandomTirageWin();

    expect(randomTirage.numeros.length).toBe(5);
    expect(randomTirage.etoiles.length).toBe(2);

    // Vérifier que les numéros et les étoiles générés sont dans les plages valides
    randomTirage.numeros.forEach((num) => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(mockVariableService.gridNumero);
    });

    randomTirage.etoiles.forEach((star) => {
      expect(star).toBeGreaterThanOrEqual(1);
      expect(star).toBeLessThanOrEqual(mockVariableService.gridEtoile);
    });
  });

  it("devrait naviguer vers /resultat-simulation avec le bon état lors de l'appel de goToRandomGeneration", () => {
    component.tirages = [new Tirage('Joueur1', [1, 2, 3, 4, 5], [1, 2])];
    component.totalParticipants = 10;
    component.numberOfDraws = 5;
    component.montantTotal = 1000;

    component.goToRandomGeneration();

    // Nous ne vérifions pas les valeurs spécifiques des numéros et des étoiles
    expect(navigateSpy).toHaveBeenCalledWith(
      ['/resultat-simulation'],
      expect.objectContaining({
        state: expect.objectContaining({
          tirages: component.tirages,
          totalParticipants: component.totalParticipants,
          numberOfDraws: component.numberOfDraws,
          montantTotal: component.montantTotal,
          tirageWin: expect.any(Tirage), // On s'attend à un objet de type Tirage
        }),
      }),
    );
  });

  it("devrait naviguer vers /ticket-win-form avec le bon état lors de l'appel de goToManualEntry", () => {
    component.tirages = [new Tirage('Joueur1', [1, 2, 3, 4, 5], [1, 2])];
    component.totalParticipants = 10;
    component.numberOfDraws = 5;
    component.montantTotal = 1000;

    component.goToManualEntry();

    expect(navigateSpy).toHaveBeenCalledWith(['/ticket-win-form'], {
      state: {
        tirages: component.tirages,
        totalParticipants: component.totalParticipants,
        numberOfDraws: component.numberOfDraws,
        montantTotal: component.montantTotal,
      },
    });
  });
});
