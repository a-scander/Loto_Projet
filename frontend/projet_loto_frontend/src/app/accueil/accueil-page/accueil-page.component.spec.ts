import { Router } from '@angular/router';
import { AccueilPageComponent } from './accueil-page.component';
import { TestBed } from '@angular/core/testing';
import { BannerComponent } from '../banner/banner.component';
import { AboutComponent } from '../about/about.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { Location } from '@angular/common';

describe('AccueilPageComponent', () => {
  let component: AccueilPageComponent;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    // Mock du service Router
    const routerMock = {
      navigate: jest.fn(),
    };

    // Configuration du module de test
    TestBed.configureTestingModule({
      imports: [
        AccueilPageComponent,
        BannerComponent,
        AboutComponent,
        HowItWorksComponent,
        StatisticsComponent,
      ],
      providers: [{ provide: Router, useValue: routerMock }],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = TestBed.createComponent(AccueilPageComponent).componentInstance;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait rediriger vers /simulation quand startSimulation est appelé', () => {
    component.startSimulation();
    expect(router.navigate).toHaveBeenCalledWith(['/simulation']);
  });

  it('devrait rediriger vers /historique quand goToHistory est appelé', () => {
    component.goToHistory();
    expect(router.navigate).toHaveBeenCalledWith(['/historique']);
  });
});
