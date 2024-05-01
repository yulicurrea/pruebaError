import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCargaEstudiosComponent } from './dialogo-carga-estudios.component';

describe('DialogoCargaEstudiosComponent', () => {
  let component: DialogoCargaEstudiosComponent;
  let fixture: ComponentFixture<DialogoCargaEstudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoCargaEstudiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoCargaEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
