import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriquePageComponent } from './historique-page.component';
import { BdTirageService } from '../../services/bdservices/bd-tirage.service';
import { VariableService } from '../../services/variableservices/variable.service';
import { of } from 'rxjs';

describe('HistoriquePageComponent', () => {
  let component: HistoriquePageComponent;
  let fixture: ComponentFixture<HistoriquePageComponent>;
  let bdTirageServiceMock: any;
  let variableServiceMock: any;

  beforeEach(() => {
    // Mock du service BdTirageService
    bdTirageServiceMock = {
      getAllTirage: jest
        .fn()
        .mockReturnValue(of([{ id: 1, pseudo: 'TestUser' }])),
      applyAdvancedFilters: jest
        .fn()
        .mockReturnValue(of([{ id: 1, pseudo: 'FilteredUser' }])),
      deleteTirage: jest.fn().mockReturnValue(of({})),
    };

    // Mock du service VariableService
    variableServiceMock = {
      selectionMaxStar: 2,
      selectionMaxNumber: 5,
    };

    TestBed.configureTestingModule({
      imports: [HistoriquePageComponent], // Since the component is standalone, it goes in imports
      providers: [
        { provide: BdTirageService, useValue: bdTirageServiceMock },
        { provide: VariableService, useValue: variableServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriquePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche ngOnInit
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les données correctement', () => {
    expect(bdTirageServiceMock.getAllTirage).toHaveBeenCalled(); // Vérifie que le service est appelé
    expect(component.allTirages.length).toBe(1); // Vérifie que les données sont bien initialisées
    expect(component.filteredTirages.length).toBe(1); // Les tirages doivent être affichés par défaut
    expect(component.allTirages[0].pseudo).toBe('TestUser');
  });

  it('devrait appliquer les filtres avancés correctement', () => {
    component.applyAdvancedFilters();
    expect(bdTirageServiceMock.applyAdvancedFilters).toHaveBeenCalled(); // Vérifie que le service de filtre est appelé
    expect(component.filteredTirages[0].pseudo).toBe('FilteredUser'); // Vérifie que les résultats sont filtrés
  });

  it('devrait supprimer un tirage', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true); // Simule une confirmation
    component.deleteTirage(1);

    expect(bdTirageServiceMock.deleteTirage).toHaveBeenCalledWith(1); // Vérifie que la suppression est appelée avec le bon ID
    expect(component.filteredTirages.length).toBe(0); // Vérifie que le tirage est bien supprimé de la liste
  });
});
