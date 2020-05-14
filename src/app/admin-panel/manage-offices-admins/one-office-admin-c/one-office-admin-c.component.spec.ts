import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOfficeAdminCComponent } from './one-office-admin-c.component';

describe('OneOfficeAdminCComponent', () => {
  let component: OneOfficeAdminCComponent;
  let fixture: ComponentFixture<OneOfficeAdminCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneOfficeAdminCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneOfficeAdminCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
