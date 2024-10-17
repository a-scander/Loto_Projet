import { TestBed } from '@angular/core/testing';
import { VariableService } from './variable.service';

describe('VariableService', () => {
  let service: VariableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VariableService],
    });
    service = TestBed.inject(VariableService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait retourner la somme du tirage par défaut', () => {
    expect(service.sommeTirage).toBe(3000000);
  });

  it('devrait pouvoir mettre à jour la somme du tirage', () => {
    service.sommeTirage = 5000000;
    expect(service.sommeTirage).toBe(5000000);
  });

  it('ne devrait pas accepter une somme du tirage négative', () => {
    service.sommeTirage = -100;
    expect(service.sommeTirage).toBe(3000000); // La valeur ne doit pas changer
  });

  it('devrait retourner le nombre de participants par défaut', () => {
    expect(service.nbParticipant).toBe(100);
  });

  it('devrait retourner la taille de la grille de numéros', () => {
    expect(service.gridNumero).toBe(49);
  });

  it('devrait retourner la taille de la grille d\'étoiles', () => {
    expect(service.gridEtoile).toBe(9);
  });

  it('devrait retourner le nombre maximum de numéros sélectionnables', () => {
    expect(service.selectionMaxNumber).toBe(5);
  });

  it('devrait retourner le nombre maximum d\'étoiles sélectionnables', () => {
    expect(service.selectionMaxStar).toBe(2);
  });

  it('devrait retourner le nombre d\'éléments par rangée dans la grille', () => {
    expect(service.printRangGrid).toBe(10);
  });

  it('devrait pouvoir mettre à jour le nombre d\'éléments par rangée dans la grille', () => {
    service.printRangGrid = 7;
    expect(service.printRangGrid).toBe(7);
  });

  it('ne devrait pas accepter un nombre d\'éléments par rangée de grille inférieur ou égal à zéro', () => {
    service.printRangGrid = 0;
    expect(service.printRangGrid).toBe(10); // La valeur ne doit pas changer
  });

  it('devrait retourner le nombre de tirages par défaut', () => {
    expect(service.numberOfDraws).toBe(1);
  });
});
