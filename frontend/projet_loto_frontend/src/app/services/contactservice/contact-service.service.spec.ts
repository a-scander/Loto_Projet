import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ContactServiceService } from './contact-service.service';
import { HttpClient } from '@angular/common/http';

describe('ContactServiceService', () => {
  let service: ContactServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactServiceService],
    });
    service = TestBed.inject(ContactServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer les informations du formulaire de contact via POST', () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'Ceci est un message de test.',
    };

    const mockResponse = { success: true };

    service.sendContactForm(mockContactData).subscribe((response) => {
      expect(response).toEqual(mockResponse); // Vérifie que la réponse est correcte
    });

    const req = httpMock.expectOne('http://localhost:3000/api/contact/send');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockContactData); // Vérifie que le corps de la requête est correct
    expect(req.request.headers.get('Content-Type')).toBe('application/json'); // Vérifie que l'en-tête est correct

    req.flush(mockResponse); // Simule la réponse de l'API
  });
});
