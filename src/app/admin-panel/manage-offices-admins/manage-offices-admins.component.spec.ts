import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOfficesAdminsComponent } from './manage-offices-admins.component';

describe('ManageOfficesAdminsComponent', () => {
  let component: ManageOfficesAdminsComponent;
  let fixture: ComponentFixture<ManageOfficesAdminsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageOfficesAdminsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOfficesAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
