import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientosComunesComponent } from './tratamientos-comunes.component';

describe('TratamientosComunesComponent', () => {
  let component: TratamientosComunesComponent;
  let fixture: ComponentFixture<TratamientosComunesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TratamientosComunesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TratamientosComunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
