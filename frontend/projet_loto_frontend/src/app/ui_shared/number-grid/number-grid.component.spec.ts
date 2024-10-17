import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberGridComponent } from './number-grid.component';
import { VariableService } from '../../services/variableservices/variable.service';
import { EventEmitter } from '@angular/core';

describe('NumberGridComponent', () => {
  let component: NumberGridComponent;
  let fixture: ComponentFixture<NumberGridComponent>;

  const mockVariableService = {
    gridEtoile: 12,
    gridNumero: 50,
    printRangGrid: 10,
  } as VariableService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberGridComponent],
      providers: [{ provide: VariableService, useValue: mockVariableService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberGridComponent);
    component = fixture.componentInstance;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser gridNumbers lors de ngOnInit', () => {
    component.type = 'numero';
    component.ngOnInit();
    expect(component.gridNumbers.length).toBe(mockVariableService.gridNumero);
    expect(component.gridNumbers).toEqual(
      Array.from({ length: mockVariableService.gridNumero }, (_, i) => i + 1),
    );
  });

  it('devrait sélectionner un numéro', () => {
    component.maxSelections = 5;
    component.selectNumber(3);
    expect(component.selectedNumbers).toContain(3);
  });

  it('devrait désélectionner un numéro', () => {
    component.selectedNumbers = [1, 2, 3];
    component.selectNumber(2);
    expect(component.selectedNumbers).not.toContain(2);
  });

  it('ne devrait pas permettre de sélectionner plus que maxSelections', () => {
    component.maxSelections = 2;
    component.selectNumber(1);
    component.selectNumber(2);
    component.selectNumber(3);
    expect(component.selectedNumbers.length).toBe(component.maxSelections);
  });

  it('devrait émettre les numéros sélectionnés lors de la confirmation', () => {
    const emitSpy = jest.spyOn(component.selectionConfirmed, 'emit'); // Utilisation de jest.spyOn
    component.selectedNumbers = [1, 2, 3];
    component.confirmSelection();
    expect(emitSpy).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('devrait diviser un tableau en sous-tableaux', () => {
    const result = component.chunkArray([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result[1]).toEqual([11, 12]);
  });
});
