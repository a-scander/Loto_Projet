import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let mockElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;

    // Crée un élément simulé pour la classe `.statistics`
    mockElement = document.createElement('div');
    mockElement.classList.add('statistics');
    document.body.appendChild(mockElement);

    // Spy sur `document.querySelector` pour retourner l'élément simulé
    jest.spyOn(document, 'querySelector').mockReturnValue(mockElement);

    fixture.detectChanges();
  });

  afterEach(() => {
    // Nettoyage après chaque test
    document.body.removeChild(mockElement);
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les valeurs des statistiques correctement', () => {
    expect(component.simulationsRapides).toBe(0);
    expect(component.simulationsPersonnalisees).toBe(0);
    expect(component.personnesInscrites).toBe(0);
    expect(component.finalSimulationsRapides).toBe(1000000);
    expect(component.finalSimulationsPersonnalisees).toBe(1500000);
    expect(component.finalPersonnesInscrites).toBe(50000);
  });

  it("devrait démarrer l'animation des statistiques", () => {
    const animateValueSpy = jest.spyOn(component, 'animateValue');

    component.animateStats();

    expect(animateValueSpy).toHaveBeenCalledTimes(3); // Les 3 animations doivent être appelées
    expect(animateValueSpy).toHaveBeenCalledWith(
      'simulationsRapides',
      component.finalSimulationsRapides,
      2000,
    );
    expect(animateValueSpy).toHaveBeenCalledWith(
      'simulationsPersonnalisees',
      component.finalSimulationsPersonnalisees,
      2000,
    );
    expect(animateValueSpy).toHaveBeenCalledWith(
      'personnesInscrites',
      component.finalPersonnesInscrites,
      2000,
    );
  });

  it('ne devrait pas animer les statistiques si déjà animé', () => {
    component.statsAnimated = true; // Simulation d'une animation déjà lancée
    const animateStatsSpy = jest.spyOn(component, 'animateStats');

    window.dispatchEvent(new Event('scroll')); // Simuler l'événement de défilement
    fixture.detectChanges();

    expect(animateStatsSpy).not.toHaveBeenCalled(); // L'animation ne doit pas être relancée
  });
});
