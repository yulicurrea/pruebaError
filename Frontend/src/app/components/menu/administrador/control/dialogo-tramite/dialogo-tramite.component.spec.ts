import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoTramiteEntregableAdministrativoComponent } from './dialogo-tramite-entregable-administrativo.component';

describe('DialogoTramiteEntregableAdministrativoComponent', () => {
  let component: DialogoTramiteEntregableAdministrativoComponent;
  let fixture: ComponentFixture<DialogoTramiteEntregableAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoTramiteEntregableAdministrativoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoTramiteEntregableAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
