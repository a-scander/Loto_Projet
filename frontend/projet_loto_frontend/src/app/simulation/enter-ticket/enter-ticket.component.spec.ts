import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterTicketComponent } from './enter-ticket.component';
import { Router } from '@angular/router';
import { VariableService } from '../../services/variableservices/variable.service';
import { BdTirageService } from '../../services/bdservices/bd-tirage.service';
import { of } from 'rxjs';
import { Tirage } from '../../models/tirage-model';

describe('EnterTicketComponent', () => {
  let component: EnterTicketComponent;
  let fixture: ComponentFixture<EnterTicketComponent>;
  let router: Router;
  let variableService: VariableService;
  let bdTirageService: BdTirageService;

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };
    const variableServiceMock = {
      selectionMaxNumber: 5,
      selectionMaxStar: 2,
      gridNumero: 50,
      gridEtoile: 12,
    };
    const bdTirageServiceMock = {
      checkPseudo: jest.fn(), // Mock de la méthode checkPseudo
      getPseudo: jest.fn().mockReturnValue(of([])), // Mock de getPseudo
    };

    // Mocking the history.state values for the test
    Object.defineProperty(window, 'history', {
      value: {
        state: {
          totalParticipants: 100,
          numberOfDraws: 10,
          montantTotal: 50000,
        },
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [EnterTicketComponent], // Ajouter directement le composant standalone dans les imports
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: VariableService, useValue: variableServiceMock },
        { provide: BdTirageService, useValue: bdTirageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnterTicketComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    variableService = TestBed.inject(VariableService);
    bdTirageService = TestBed.inject(BdTirageService);
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait générer un pseudo aléatoire', () => {
    component.generatePseudo();
    expect(component.pseudo).not.toBe('');
    expect(component.pseudo).toMatch(/^[A-Za-z0-9]+$/); // Vérifie que le pseudo est alphanumérique
  });

  it('devrait générer des numéros aléatoires', () => {
    component.generateRandomNumbers();
    expect(component.selectedNumbers.length).toBe(
      variableService.selectionMaxNumber,
    ); // 5 numéros générés
    component.selectedNumbers.forEach((num) => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(variableService.gridNumero); // Entre 1 et 50
    });
  });

  it('devrait générer des étoiles aléatoires', () => {
    component.generateRandomStars();
    expect(component.selectedStars.length).toBe(
      variableService.selectionMaxStar,
    ); // 2 étoiles générées
    component.selectedStars.forEach((star) => {
      expect(star).toBeGreaterThanOrEqual(1);
      expect(star).toBeLessThanOrEqual(variableService.gridEtoile); // Entre 1 et 12
    });
  });

  it('devrait générer des données de tableau après validation du ticket', async () => {
    component.pseudo = 'TestUser';
    component.selectedNumbers = [1, 2, 3, 4, 5];
    component.selectedStars = [1, 2];
    component.selectedNumbersString = '1, 2, 3, 4, 5';
    component.selectedStarsString = '1, 2';

    await component.validateTicket();

    expect(component.tableData.length).toBe(1); // Un ticket ajouté
    expect(component.tableData[0].pseudo).toBe('TestUser');
    expect(component.tableData[0].numeros).toBe('1, 2, 3, 4, 5');
    expect(component.tableData[0].etoiles).toBe('1, 2');
  });

  it('devrait vérifier le pseudo avec succès', async () => {
    (bdTirageService.checkPseudo as jest.Mock).mockResolvedValueOnce({
      exists: false,
    });
    component.pseudo = 'ValidPseudo';
    await component.checkPseudo();
    expect(component.showPseudoError).toBeFalsy();
    expect(component.pseudoMessage).toBe('Ce pseudo est disponible.');
  });

  it('devrait marquer une erreur si le pseudo existe', async () => {
    (bdTirageService.checkPseudo as jest.Mock).mockResolvedValueOnce({
      exists: true,
    });
    component.pseudo = 'ExistingPseudo';
    await component.checkPseudo();
    expect(component.showPseudoError).toBeTruthy();
    expect(component.pseudoMessage).toBe(
      'Ce pseudo est déjà pris dans la base de données.',
    );
  });
});
