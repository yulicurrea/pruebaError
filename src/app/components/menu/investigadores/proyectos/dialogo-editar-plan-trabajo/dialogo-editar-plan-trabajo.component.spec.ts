import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEditarPlanTrabajoComponent } from './dialogo-editar-plan-trabajo.component';

describe('DialogoEditarPlanTrabajoComponent', () => {
  let component: DialogoEditarPlanTrabajoComponent;
  let fixture: ComponentFixture<DialogoEditarPlanTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoEditarPlanTrabajoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoEditarPlanTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
