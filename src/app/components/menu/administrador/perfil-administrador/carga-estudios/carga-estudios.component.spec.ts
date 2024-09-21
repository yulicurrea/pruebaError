import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaEstudiosComponent } from './carga-estudios.component';

describe('CargaEstudiosComponent', () => {
  let component: CargaEstudiosComponent;
  let fixture: ComponentFixture<CargaEstudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaEstudiosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargaEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
