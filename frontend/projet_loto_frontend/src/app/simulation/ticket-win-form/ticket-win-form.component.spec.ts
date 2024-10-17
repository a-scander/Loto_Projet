import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketWinFormComponent } from './ticket-win-form.component';

describe('TicketWinFormComponent', () => {
  let component: TicketWinFormComponent;
  let fixture: ComponentFixture<TicketWinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketWinFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketWinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
