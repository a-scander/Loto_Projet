import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationFormulaireComponent } from './simulation-formulaire.component';

describe('SimulationFormulaireComponent', () => {
  let component: SimulationFormulaireComponent;
  let fixture: ComponentFixture<SimulationFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationFormulaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
