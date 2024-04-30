import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAvanceEntregableComponent } from './dialogo-avance-entregable.component';

describe('DialogoAvanceEntregableComponent', () => {
  let component: DialogoAvanceEntregableComponent;
  let fixture: ComponentFixture<DialogoAvanceEntregableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoAvanceEntregableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoAvanceEntregableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
