import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCreacionParticipantesComponent } from './dialogo-creacion-participantes.component';

describe('DialogoCreacionParticipantesComponent', () => {
  let component: DialogoCreacionParticipantesComponent;
  let fixture: ComponentFixture<DialogoCreacionParticipantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoCreacionParticipantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoCreacionParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
