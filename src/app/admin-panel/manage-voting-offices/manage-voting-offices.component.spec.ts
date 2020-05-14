import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVotingOfficesComponent } from './manage-voting-offices.component';

describe('ManageVotingOfficesComponent', () => {
  let component: ManageVotingOfficesComponent;
  let fixture: ComponentFixture<ManageVotingOfficesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVotingOfficesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVotingOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
