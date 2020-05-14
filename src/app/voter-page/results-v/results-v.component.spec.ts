import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsVComponent } from './results-v.component';

describe('ResultsVComponent', () => {
  let component: ResultsVComponent;
  let fixture: ComponentFixture<ResultsVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
