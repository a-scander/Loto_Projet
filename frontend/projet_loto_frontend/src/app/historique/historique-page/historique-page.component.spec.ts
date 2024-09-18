import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePageComponent } from './historique-page.component';

describe('HistoriquePageComponent', () => {
  let component: HistoriquePageComponent;
  let fixture: ComponentFixture<HistoriquePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriquePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriquePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
