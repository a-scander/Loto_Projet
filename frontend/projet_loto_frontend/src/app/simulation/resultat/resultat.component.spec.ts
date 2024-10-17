import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ResultatComponent } from './resultat.component';
import { TirageService } from '../../services/services/tirage.service';
import { BdTirageService } from '../../services/bdservices/bd-tirage.service';
import { of } from 'rxjs';
import { Tirage } from '../../models/tirage-model';

// Mock des services
class MockTirageService {
  classerTiragesEtCalculerGains() {
    return of({
      classement: [
        { pseudo: 'Player1', numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
      ],
      positions: [1],
      gains: [1000],
    });
  }
}

class MockBdTirageService {
  saveTirageData(data: any) {
    return of({ success: true });
  }
}

describe('ResultatComponent', () => {
  let component: ResultatComponent;
  let fixture: ComponentFixture<ResultatComponent>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(), // Mock de la méthode navigate
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ResultatComponent], // Utiliser imports pour les composants autonomes
      providers: [
        { provide: Router, useValue: routerMock }, // Utiliser jest.Mocked pour Router
        { provide: TirageService, useClass: MockTirageService }, // Mock du TirageService
        { provide: BdTirageService, useClass: MockBdTirageService }, // Mock du BdTirageService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultatComponent);
    component = fixture.componentInstance;
  });

  // Fonction utilitaire pour simuler l'état de navigation
  function setMockHistoryState(mockState: any) {
    Object.defineProperty(history, 'state', {
      value: mockState,
      configurable: true,
    });
  }

  it('devrait être créé', () => {
    setMockHistoryState({
      totalParticipants: 100,
      numberOfDraws: 10,
      montantTotal: 50000,
      tirages: [
        { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2], pseudo: 'Player1' },
      ],
      tirageWin: { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
    });

    fixture.detectChanges(); // Détecter les changements après avoir initialisé l'état
    expect(component).toBeTruthy();
  });

  it('devrait initialiser correctement les données avec ngOnInit', () => {
    const mockState = {
      totalParticipants: 100,
      numberOfDraws: 10,
      montantTotal: 50000,
      tirages: [
        { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2], pseudo: 'Player1' },
      ],
      tirageWin: { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
    };

    setMockHistoryState(mockState);

    component.ngOnInit(); // Appeler ngOnInit
    fixture.detectChanges(); // Détecter les changements après l'initialisation

    expect(component.totalParticipants).toBe(100);
    expect(component.numberOfDraws).toBe(10);
    expect(component.montantTotal).toBe(50000);
    expect(component.tirages.length).toBe(1);
    expect(component.tirageWin.numeros).toEqual([1, 2, 3, 4, 5]);
  });

  it('devrait afficher une erreur si les tableaux ont des longueurs différentes', () => {
    component.classement = [
      { pseudo: 'Player1', numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
    ];
    component.positions = [1];
    component.gains = []; // Gains manquants

    console.error = jest.fn(); // Mock de console.error

    component.generateTableData();
    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith(
      'Les tailles des tableaux classement, positions et gains ne correspondent pas.',
    );
  });

  it('devrait enregistrer les tirages dans la base de données', () => {
    const mockSaveTirageData = jest
      .spyOn(TestBed.inject(BdTirageService), 'saveTirageData')
      .mockReturnValue(of({ success: true }));

    component.classement = [
      { pseudo: 'Player1', numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
    ];
    component.positions = [1];
    component.gains = [1000];
    component.tirageWin = {
      numeros: [1, 2, 3, 4, 5],
      etoiles: [1, 2],
    } as Tirage;
    component.numberOfDraws = 1;
    component.montantTotal = 50000;
    component.totalParticipants = 100;
    component.tirages = [
      { pseudo: 'Player1', numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
    ];

    component.enregistrerTirages();
    fixture.detectChanges();

    expect(mockSaveTirageData).toHaveBeenCalledWith({
      tirages: [
        {
          numeros: [1, 2, 3, 4, 5],
          etoiles: [1, 2],
          pseudo: 'Player1',
          gain: 1000,
        },
      ],
      montantPartie: 50000,
      tirageGagnant: { numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
      totalParticipants: 100,
    });
  });

  it("devrait naviguer vers la page d'accueil", () => {
    component.goToAccueil();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/accueil']);
  });

  it('devrait naviguer vers la page de simulation', () => {
    component.goToSimulation();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/simulation']);
  });

  it("devrait naviguer vers la page d'historique", () => {
    component.goToHistorique();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/historique']);
  });
});
