import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TicketWinFormComponent } from './ticket-win-form.component';
import { VariableService } from '../../services/variableservices/variable.service';
import { Tirage } from '../../models/tirage-model';
import { of } from 'rxjs'; // Utilisé pour des mocks asynchrones

class MockVariableService {
  selectionMaxNumber = 5;
  selectionMaxStar = 2;
  gridNumero = 50;
  gridEtoile = 12;
}

describe('TicketWinFormComponent', () => {
  let component: TicketWinFormComponent;
  let fixture: ComponentFixture<TicketWinFormComponent>;
  let routerSpy = { navigate: jest.fn() };
  let service: MockVariableService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketWinFormComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: VariableService, useClass: MockVariableService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketWinFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(VariableService);
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it("devrait initialiser correctement les données à partir de l'état", () => {
    const mockState = {
      totalParticipants: 100,
      numberOfDraws: 10,
      montantTotal: 50000,
      tirages: [{ numbers: [1, 2, 3, 4, 5], stars: [1, 2] }],
    };
    history.pushState(mockState, '');
    component.ngOnInit();
    expect(component.totalParticipants).toBe(100);
    expect(component.numberOfDraws).toBe(10);
    expect(component.montantTotal).toBe(50000);
    expect(component.tirages.length).toBe(1);
  });

  it('devrait générer des numéros aléatoires sans doublon', () => {
    component.generateRandomNumbers();
    expect(component.selectedNumbers.length).toBe(service.selectionMaxNumber);
    const uniqueNumbers = new Set(component.selectedNumbers);
    expect(uniqueNumbers.size).toBe(service.selectionMaxNumber);
  });

  it('devrait générer des étoiles aléatoires sans doublon', () => {
    component.generateRandomStars();
    expect(component.selectedStars.length).toBe(service.selectionMaxStar);
    const uniqueStars = new Set(component.selectedStars);
    expect(uniqueStars.size).toBe(service.selectionMaxStar);
  });

  it('devrait générer à la fois des numéros et des étoiles aléatoires', () => {
    component.generateAll();
    expect(component.selectedNumbers.length).toBe(service.selectionMaxNumber);
    expect(component.selectedStars.length).toBe(service.selectionMaxStar);
  });

  it('devrait ouvrir la grille des numéros', () => {
    component.openNumberGrid();
    expect(component.showNumberGrid).toBe(true); // Remplacer `toBeTrue()` par `toBe(true)`
  });

  it('devrait ouvrir la grille des étoiles', () => {
    component.openStarGrid();
    expect(component.showStarGrid).toBe(true); // Remplacer `toBeTrue()` par `toBe(true)`
  });

  it('devrait fermer les grilles de sélection', () => {
    component.closeGrid();
    expect(component.showNumberGrid).toBe(false); // Remplacer `toBeFalse()` par `toBe(false)`
    expect(component.showStarGrid).toBe(false); // Remplacer `toBeFalse()` par `toBe(false)`
  });

  it('devrait valider le formulaire correctement', () => {
    component.selectedNumbersString = '1, 2, 3, 4, 5';
    component.selectedStarsString = '1, 2';
    expect(component.isFormValid()).toBe(true); // Remplacer `toBeTrue()` par `toBe(true)`
  });

  it('devrait détecter un formulaire invalide (numéros incorrects)', () => {
    component.selectedNumbersString = '1, 2';
    component.selectedStarsString = '1, 2';
    expect(component.isFormValid()).toBe(false); // Remplacer `toBeFalse()` par `toBe(false)`
  });

  it('devrait gérer la sélection des numéros et fermer la grille', () => {
    const selectedNumbers = [1, 2, 3, 4, 5];
    component.onNumbersSelected(selectedNumbers);
    expect(component.selectedNumbersString).toBe('1, 2, 3, 4, 5');
    expect(component.showNumberGrid).toBe(false); // Remplacer `toBeFalse()` par `toBe(false)`
  });

  it('devrait gérer la sélection des étoiles et fermer la grille', () => {
    const selectedStars = [1, 2];
    component.onStarsSelected(selectedStars);
    expect(component.selectedStarsString).toBe('1, 2');
    expect(component.showStarGrid).toBe(false); // Remplacer `toBeFalse()` par `toBe(false)`
  });

  it('devrait valider le ticket et rediriger vers la page des résultats', () => {
    component.selectedNumbersString = '1, 2, 3, 4, 5';
    component.selectedStarsString = '1, 2';
    component.tirages = [
      { pseudo: 'test', numeros: [1, 2, 3, 4, 5], etoiles: [1, 2] },
    ];
    component.totalParticipants = 100;
    component.numberOfDraws = 10;
    component.montantTotal = 50000;

    component.validateTicket();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultat-simulation'], {
      state: {
        tirages: component.tirages,
        totalParticipants: 100,
        numberOfDraws: 10,
        montantTotal: 50000,
        tirageWin: component.tirageWin,
      },
    });
  });
});
