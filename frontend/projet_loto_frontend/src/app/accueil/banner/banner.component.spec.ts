import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BannerComponent } from './banner.component';
import { ButtonComponent } from '../../ui_shared/button/button.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let routerMock: any;

  beforeEach(() => {
    // Mock du service Router
    routerMock = {
      navigate: jest.fn(), // Mock de la méthode navigate
    };

    TestBed.configureTestingModule({
      imports: [BannerComponent, ButtonComponent], // Ajout de BannerComponent et ButtonComponent
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche ngOnInit et d'autres hooks
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait rediriger vers /simulation quand onButtonClick est appelé', () => {
    // Appel de la méthode onButtonClick
    component.onButtonClick();

    // Vérifie que router.navigate a été appelé avec la route '/simulation'
    expect(routerMock.navigate).toHaveBeenCalledWith(['/simulation']);
  });
});
