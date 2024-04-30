import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoNotificacionesComponent } from './dialogo-notificaciones.component';

describe('DialogoNotificacionesComponent', () => {
  let component: DialogoNotificacionesComponent;
  let fixture: ComponentFixture<DialogoNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoNotificacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
