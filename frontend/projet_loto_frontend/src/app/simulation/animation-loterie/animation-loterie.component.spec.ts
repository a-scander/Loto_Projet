import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationLoterieComponent } from './animation-loterie.component';

describe('AnimationLoterieComponent', () => {
  let component: AnimationLoterieComponent;
  let fixture: ComponentFixture<AnimationLoterieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationLoterieComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimationLoterieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
