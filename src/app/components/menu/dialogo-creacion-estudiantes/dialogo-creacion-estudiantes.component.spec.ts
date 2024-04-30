import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCreacionEstudiantesComponent } from './dialogo-creacion-estudiantes.component';

describe('DialogoCreacionEstudiantesComponent', () => {
  let component: DialogoCreacionEstudiantesComponent;
  let fixture: ComponentFixture<DialogoCreacionEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoCreacionEstudiantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoCreacionEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
