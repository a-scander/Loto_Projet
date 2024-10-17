import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TirageService } from './tirage.service';
import { Tirage } from '../../models/tirage-model';

describe('TirageService', () => {
  let service: TirageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TirageService],
    });
    service = TestBed.inject(TirageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer les tirages et calculer les gains via POST', () => {
    const mockTirages: Tirage[] = [
      { pseudo: 'Player1', numeros: [1, 2, 3], etoiles: [1, 2] },
      { pseudo: 'Player2', numeros: [4, 5, 6], etoiles: [2, 3] },
    ];

    const mockTirageWin: Tirage = {
      pseudo: 'Winner',
      numeros: [1, 2, 3],
      etoiles: [1, 2],
    };

    const montant = 1000; // Montant à calculer

    const mockResponse = {
      classement: [{ pseudo: 'Winner', gain: 500 }],
      totalGain: 1000,
    };

    service.classerTiragesEtCalculerGains(mockTirages, mockTirageWin, montant).subscribe((response) => {
      expect(response).toEqual(mockResponse); // Vérifie que la réponse est correcte
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tirages/classement-et-gains');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      tirages: mockTirages,
      tirageWin: mockTirageWin,
      montant,
    });
    
    req.flush(mockResponse); // Simule la réponse de l'API
  });
});
