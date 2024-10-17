import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { ContactServiceService } from '../../services/contactservice/contact-service.service';
import { of } from 'rxjs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactServiceMock: any;

  beforeEach(() => {
    // Mock du service ContactServiceService
    contactServiceMock = {
      sendContactForm: jest.fn().mockReturnValue(of({ success: true })),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ContactComponent], // Correction ici
      providers: [
        { provide: ContactServiceService, useValue: contactServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche ngOnInit
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire avec des champs vides', () => {
    const form = component.contactForm;
    expect(form).toBeDefined();
    expect(form.get('name')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('message')?.value).toBe('');
  });

  it('devrait rendre le formulaire invalide lorsque des champs requis sont manquants', () => {
    const form = component.contactForm;
    form.get('name')?.setValue('');
    form.get('email')?.setValue('');
    form.get('message')?.setValue('');
    expect(form.valid).toBeFalsy(); // Le formulaire doit être invalide
  });

  it('devrait envoyer le formulaire lorsque celui-ci est valide', () => {
    const form = component.contactForm;
    form.get('name')?.setValue('Test User');
    form.get('email')?.setValue('test@example.com');
    form.get('message')?.setValue('Ceci est un test');

    component.onSubmit();

    expect(form.valid).toBeTruthy(); // Le formulaire est valide
    expect(contactServiceMock.sendContactForm).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Ceci est un test',
    });
    expect(component.confirmationMessage).toBe(
      'Votre email a été envoyé avec succès !',
    );
    expect(component.emailSent).toBe(true);
  });
});
