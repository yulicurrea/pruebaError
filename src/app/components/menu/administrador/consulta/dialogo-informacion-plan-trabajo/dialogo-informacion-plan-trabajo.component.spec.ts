import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoInformacionPlanTrabajoComponent } from './dialogo-informacion-plan-trabajo.component';

describe('DialogoInformacionPlanTrabajoComponent', () => {
  let component: DialogoInformacionPlanTrabajoComponent;
  let fixture: ComponentFixture<DialogoInformacionPlanTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoInformacionPlanTrabajoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoInformacionPlanTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
