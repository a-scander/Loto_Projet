import { TestBed } from '@angular/core/testing';
import { BdTirageService } from './bd-tirage.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BdTirageService', () => {
  let service: BdTirageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BdTirageService],
    });
    service = TestBed.inject(BdTirageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait appeler l\'API pour récupérer tous les tirages', () => {
    const mockTirages = [{ id: 1, pseudo: 'User1' }];

    service.getAllTirage().subscribe((tirages) => {
      expect(tirages.length).toBe(1);
      expect(tirages).toEqual(mockTirages);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/bd/liste-tirage');
    expect(req.request.method).toBe('GET');
    req.flush(mockTirages);
  });

  it('devrait appeler l\'API pour récupérer les pseudos', () => {
    const mockPseudos = ['User1', 'User2'];

    service.getPseudo().subscribe((pseudos) => {
      expect(pseudos.length).toBe(2);
      expect(pseudos).toEqual(mockPseudos);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/bd/pseudos');
    expect(req.request.method).toBe('GET');
    req.flush(mockPseudos);
  });

  it('devrait appliquer les filtres avancés', () => {
    const filters = { pseudo: 'User1' };
    const mockFilteredResults = [{ id: 1, pseudo: 'User1' }];

    service.applyAdvancedFilters(filters).subscribe((results) => {
      expect(results.length).toBe(1);
      expect(results).toEqual(mockFilteredResults);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/bd/apply-filters');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);
    req.flush(mockFilteredResults);
  });

  it('devrait supprimer un tirage', () => {
    service.deleteTirage(1).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne('http://localhost:3000/api/bd/delete/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('devrait sauvegarder les données d\'un tirage', () => {
    const tirageData = { pseudo: 'User1', number: [1, 2, 3] };

    service.saveTirageData(tirageData).subscribe((response) => {
      expect(response).toEqual(tirageData);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/bd/save-tirage');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(tirageData);
    req.flush(tirageData);
  });

  it('devrait vérifier si un pseudo existe', async () => {
    const pseudo = 'User1';
    const mockResponse = { exists: true };

    service.checkPseudo(pseudo).then((result) => {
      expect(result.exists).toBe(true);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/bd/check-pseudo/${pseudo}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('devrait gérer une erreur lors de la vérification du pseudo', async () => {
    const pseudo = 'User1';

    service.checkPseudo(pseudo).then((result) => {
      expect(result.exists).toBe(false); // En cas d'erreur, la valeur par défaut est false
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/bd/check-pseudo/${pseudo}`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Server Error' }); // Simule une erreur serveur
  });
});
