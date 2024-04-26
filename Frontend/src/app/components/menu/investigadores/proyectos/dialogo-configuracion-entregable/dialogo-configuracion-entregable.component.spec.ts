import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfiguracionEntregableComponent } from './dialogo-configuracion-entregable.component';

describe('DialogoConfiguracionEntregableComponent', () => {
  let component: DialogoConfiguracionEntregableComponent;
  let fixture: ComponentFixture<DialogoConfiguracionEntregableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoConfiguracionEntregableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoConfiguracionEntregableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
