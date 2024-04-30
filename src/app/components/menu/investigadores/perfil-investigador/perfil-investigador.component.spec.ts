import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilInvestigadorComponent } from './perfil-investigador.component';

describe('PerfilInvestigadorComponent', () => {
  let component: PerfilInvestigadorComponent;
  let fixture: ComponentFixture<PerfilInvestigadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilInvestigadorComponent]
    });
    fixture = TestBed.createComponent(PerfilInvestigadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
