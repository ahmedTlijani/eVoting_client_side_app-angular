import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneVotingOfficeCComponent } from './one-voting-office-c.component';

describe('OneVotingOfficeCComponent', () => {
  let component: OneVotingOfficeCComponent;
  let fixture: ComponentFixture<OneVotingOfficeCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneVotingOfficeCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneVotingOfficeCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
