import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait calculer le nombre total de pages', () => {
    component.totalItems = 100; // Exemple de 100 éléments
    component.itemsPerPage = 10; // 10 éléments par page
    expect(component.totalPages).toBe(10); // Devrait y avoir 10 pages
  });

  it('devrait générer un tableau des numéros de pages', () => {
    component.totalItems = 50; // Exemple de 50 éléments
    component.itemsPerPage = 10; // 10 éléments par page
    expect(component.pages).toEqual([1, 2, 3, 4, 5]); // Devrait y avoir 5 pages
  });

  it("devrait changer de page et émettre l'événement pageChange", () => {
    jest.spyOn(component.pageChange, 'emit'); // Surveillez l'émission de l'événement pageChange

    component.totalItems = 100; // Exemple de 100 éléments
    component.itemsPerPage = 10; // 10 éléments par page

    component.changePage(2); // Change à la page 2
    expect(component.currentPage).toBe(2); // Vérifie que la page actuelle a changé
    expect(component.pageChange.emit).toHaveBeenCalledWith(2); // Vérifie que l'événement a été émis
  });

  it('ne devrait pas changer de page si la page est hors limites', () => {
    jest.spyOn(component.pageChange, 'emit'); // Surveillez l'émission de l'événement pageChange

    component.totalItems = 50; // Exemple de 50 éléments
    component.itemsPerPage = 10; // 10 éléments par page

    component.changePage(6); // Essaye de changer à la page 6 (ce qui est hors limites)
    expect(component.currentPage).toBe(1); // La page actuelle doit rester 1
    expect(component.pageChange.emit).not.toHaveBeenCalled(); // Vérifie que l'événement n'a pas été émis
  });
});
