import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvesigadoresComponent } from './invesigadores.component';

describe('InvesigadoresComponent', () => {
  let component: InvesigadoresComponent;
  let fixture: ComponentFixture<InvesigadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvesigadoresComponent]
    });
    fixture = TestBed.createComponent(InvesigadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
