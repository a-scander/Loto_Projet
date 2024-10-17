import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickSimulationComponent } from './quick-simulation.component';
import { VariableService } from '../../services/variableservices/variable.service';
import { BdTirageService } from '../../services/bdservices/bd-tirage.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Tirage } from '../../models/tirage-model';

describe('QuickSimulationComponent', () => {
  let component: QuickSimulationComponent;
  let fixture: ComponentFixture<QuickSimulationComponent>;
  let mockVariableService: any;
  let mockBdTirageService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockVariableService = {
      selectionMaxNumber: 5,
      selectionMaxStar: 2,
      gridNumero: 50,
      gridEtoile: 12,
      nbParticipant: 100,
      numberOfDraws: 10,
      sommeTirage: 100000,
    };

    mockBdTirageService = {
      checkPseudo: jest.fn().mockResolvedValue({ exists: false }),
      getPseudo: jest.fn().mockReturnValue(of([])),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [QuickSimulationComponent], // Ajout du composant standalone directement
      providers: [
        { provide: VariableService, useValue: mockVariableService },
        { provide: BdTirageService, useValue: mockBdTirageService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait générer un pseudo aléatoire', () => {
    component.generatePseudo();
    expect(component.pseudo).toMatch(/^[A-Za-z0-9]+$/); // Vérifie que le pseudo est alphanumérique
    expect(component.pseudo.length).toBeGreaterThanOrEqual(8); // Pseudo de longueur minimale 8
    expect(component.pseudo.length).toBeLessThanOrEqual(12); // Pseudo de longueur maximale 12
  });

  it('devrait générer des numéros aléatoires', () => {
    component.generateRandomNumbers();
    expect(component.selectedNumbers.length).toBe(mockVariableService.selectionMaxNumber); // Vérifie que 5 numéros sont générés
    component.selectedNumbers.forEach((num) => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(mockVariableService.gridNumero); // Numéro entre 1 et 50
    });
  });

  it('devrait générer des étoiles aléatoires', () => {
    component.generateRandomStars();
    expect(component.selectedStars.length).toBe(mockVariableService.selectionMaxStar); // Vérifie que 2 étoiles sont générées
    component.selectedStars.forEach((star) => {
      expect(star).toBeGreaterThanOrEqual(1);
      expect(star).toBeLessThanOrEqual(mockVariableService.gridEtoile); // Étoile entre 1 et 12
    });
  });

  it('devrait vérifier que le formulaire est valide', () => {
    component.pseudo = 'TestUser';
    component.selectedNumbersString = '1, 2, 3, 4, 5';
    component.selectedStarsString = '1, 2';

    expect(component.isFormValid()).toBe(true); // Le formulaire devrait être valide
  });

  it('devrait renvoyer une erreur si le pseudo existe', async () => {
    mockBdTirageService.checkPseudo.mockResolvedValueOnce({ exists: true });
    component.pseudo = 'ExistingUser';

    await component.checkPseudo();

    expect(component.showPseudoError).toBe(true); // Le pseudo est déjà utilisé
    expect(component.pseudoMessage).toBe('Ce pseudo est déjà pris dans la base de données.');
  });

  it('devrait rediriger vers /resultat-simulation après validation', async () => {
    component.pseudo = 'TestUser';
    component.selectedNumbers = [1, 2, 3, 4, 5];
    component.selectedStars = [1, 2];
    component.selectedNumbersString = '1, 2, 3, 4, 5';
    component.selectedStarsString = '1, 2';

    await component.validateTicket();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/resultat-simulation'], {
      state: expect.objectContaining({
        tirages: expect.any(Array), // Vérifie qu'il y a des tirages dans l'état
        totalParticipants: mockVariableService.nbParticipant,
        numberOfDraws: mockVariableService.numberOfDraws,
        montantTotal: mockVariableService.sommeTirage,
        tirageWin: expect.any(Tirage), // Vérifie que tirageWin est bien un Tirage
      }),
    });
  });

  it('devrait générer des tirages supplémentaires', () => {
    const initialTirageCount = component.tirages.length;
    component.generateAdditionalDraws();
    expect(component.tirages.length).toBeGreaterThan(initialTirageCount); // Le nombre de tirages devrait augmenter
  });
});
