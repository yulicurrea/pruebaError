import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEditarFechaComponent } from './dialogo-editar-fecha.component';

describe('DialogoEditarFechaComponent', () => {
  let component: DialogoEditarFechaComponent;
  let fixture: ComponentFixture<DialogoEditarFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoEditarFechaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoEditarFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
