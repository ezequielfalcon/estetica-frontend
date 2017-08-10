import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoNuevaHistoriaComponent } from './dialogo-nueva-historia.component';

describe('DialogoNuevaHistoriaComponent', () => {
  let component: DialogoNuevaHistoriaComponent;
  let fixture: ComponentFixture<DialogoNuevaHistoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoNuevaHistoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoNuevaHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
