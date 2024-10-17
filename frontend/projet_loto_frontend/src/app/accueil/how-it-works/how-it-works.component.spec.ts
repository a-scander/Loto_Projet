import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HowItWorksComponent } from './how-it-works.component';

describe('HowItWorksComponent', () => {
  let component: HowItWorksComponent;
  let fixture: ComponentFixture<HowItWorksComponent>;
  let routerMock: any;

  beforeEach(() => {
    // Mock du service Router
    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HowItWorksComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait rediriger vers une page spécifique quand navigateTo est appelé', () => {
    const route = '/simulation';
    component.navigateTo(route);

    // Vérifie que router.navigate a été appelé avec le bon argument
    expect(routerMock.navigate).toHaveBeenCalledWith([route]);
  });
});
