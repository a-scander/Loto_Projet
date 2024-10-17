import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, FormsModule], // Importer le composant et le module de formulaires
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy(); // Vérifie que le composant est créé avec succès
  });

  it('devrait émettre searchChange lorsque le terme de recherche change', () => {
    jest.spyOn(component.searchChange, 'emit'); // Surveillez l'émission de l'événement searchChange

    const searchValue = 'test'; // Exemple de valeur de recherche
    component.onSearchChange(searchValue); // Appelle la méthode avec la valeur de recherche
    expect(component.searchChange.emit).toHaveBeenCalledWith(searchValue); // Vérifie que l'événement a été émis avec la bonne valeur
  });

  it('devrait réinitialiser la recherche et émettre une chaîne vide', () => {
    jest.spyOn(component.searchChange, 'emit'); // Surveillez l'émission de l'événement searchChange

    component.resetSearch(); // Appelle la méthode de réinitialisation
    expect(component.searchTerm).toBe(''); // Vérifie que le terme de recherche est réinitialisé
    expect(component.searchChange.emit).toHaveBeenCalledWith(''); // Vérifie que l'événement a été émis avec une chaîne vide
  });
});
