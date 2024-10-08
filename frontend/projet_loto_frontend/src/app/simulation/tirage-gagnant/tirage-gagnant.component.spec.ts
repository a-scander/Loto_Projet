import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TirageGagnantComponent } from './tirage-gagnant.component';

describe('TirageGagnantComponent', () => {
  let component: TirageGagnantComponent;
  let fixture: ComponentFixture<TirageGagnantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TirageGagnantComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TirageGagnantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
