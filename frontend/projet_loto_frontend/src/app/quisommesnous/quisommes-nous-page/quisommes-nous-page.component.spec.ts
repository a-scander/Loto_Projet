import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuisommesNousPageComponent } from './quisommes-nous-page.component';

describe('QuisommesNousPageComponent', () => {
  let component: QuisommesNousPageComponent;
  let fixture: ComponentFixture<QuisommesNousPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuisommesNousPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuisommesNousPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
