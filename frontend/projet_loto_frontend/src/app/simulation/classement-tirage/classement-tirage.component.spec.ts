import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassementTirageComponent } from './classement-tirage.component';

describe('ClassementTirageComponent', () => {
  let component: ClassementTirageComponent;
  let fixture: ComponentFixture<ClassementTirageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassementTirageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassementTirageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
