import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosPorMedicoComponent } from './turnos-por-medico.component';

describe('TurnosPorMedicoComponent', () => {
  let component: TurnosPorMedicoComponent;
  let fixture: ComponentFixture<TurnosPorMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnosPorMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnosPorMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
