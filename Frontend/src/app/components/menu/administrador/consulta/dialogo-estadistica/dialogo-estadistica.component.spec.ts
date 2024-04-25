import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEstadisticaComponent } from './DialogoEstadisticaComponent';

describe('DialogoEstadisticaComponent', () => {
  let component: DialogoEstadisticaComponent;
  let fixture: ComponentFixture<DialogoEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoEstadisticaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
