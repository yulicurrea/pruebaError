import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoPlanDeTrabajoComponent } from './dialogo-plan-de-trabajo.component';

describe('DialogoPlanDeTrabajoComponent', () => {
  let component: DialogoPlanDeTrabajoComponent;
  let fixture: ComponentFixture<DialogoPlanDeTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoPlanDeTrabajoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoPlanDeTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
