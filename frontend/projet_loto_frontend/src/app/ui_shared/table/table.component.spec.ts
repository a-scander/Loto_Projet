import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { PaginationComponent } from '../pagination/pagination.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, PaginationComponent, SearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait mettre à jour les données paginées lors du changement de page', () => {
    component.data = Array(15).fill({ id: 1 });
    component.filteredData = component.data;
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.pagedData.length).toBeGreaterThan(0);
  });

  it("devrait émettre l'événement deleteEvent lors de l'appel de deleteItem", () => {
    jest.spyOn(component.deleteEvent, 'emit');
    component.deleteItem(1);
    expect(component.deleteEvent.emit).toHaveBeenCalledWith(1);
  });

  it('devrait émettre un événement lorsque la ligne est cliquée', () => {
    jest.spyOn(component.rowClickEvent, 'emit');
    component.onRowClick(1);
    expect(component.selectedIndex).toBe(1);
    expect(component.rowClickEvent.emit).toHaveBeenCalledWith(1);
  });

  it('devrait filtrer correctement les données lors de la recherche', () => {
    component.columns = [{ header: 'Nom', key: 'name' }];
    component.data = [{ name: 'John' }, { name: 'Doe' }, { name: 'Jane' }];
    component.onSearch('Jane');
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('Jane');
  });

  it('devrait réagir correctement lors des changements des Inputs', () => {
    component.data = [{ id: 1 }, { id: 2 }];
    component.ngOnChanges({
      data: {
        currentValue: component.data,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(component.filteredData.length).toBe(2);
  });
});
