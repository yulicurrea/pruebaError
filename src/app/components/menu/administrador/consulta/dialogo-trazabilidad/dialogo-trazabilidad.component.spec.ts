import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoTrazabilidadComponent } from './dialogo-trazabilidad.component';

describe('DialogoTrazabilidadComponent', () => {
  let component: DialogoTrazabilidadComponent;
  let fixture: ComponentFixture<DialogoTrazabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoTrazabilidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoTrazabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
