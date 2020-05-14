import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnePartiCComponent } from './one-parti-c.component';

describe('OnePartiCComponent', () => {
  let component: OnePartiCComponent;
  let fixture: ComponentFixture<OnePartiCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnePartiCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnePartiCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
