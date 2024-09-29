import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapTableauComponent } from './recap-tableau.component';

describe('RecapTableauComponent', () => {
  let component: RecapTableauComponent;
  let fixture: ComponentFixture<RecapTableauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecapTableauComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecapTableauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
