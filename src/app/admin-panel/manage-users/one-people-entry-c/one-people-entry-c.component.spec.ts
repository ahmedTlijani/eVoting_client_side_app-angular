import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnePeopleEntryCComponent } from './one-people-entry-c.component';

describe('OnePeopleEntryCComponent', () => {
  let component: OnePeopleEntryCComponent;
  let fixture: ComponentFixture<OnePeopleEntryCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnePeopleEntryCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnePeopleEntryCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
