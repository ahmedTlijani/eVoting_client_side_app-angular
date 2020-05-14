import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeAdminDashboardComponent } from './office-admin-dashboard.component';

describe('OfficeAdminDashboardComponent', () => {
  let component: OfficeAdminDashboardComponent;
  let fixture: ComponentFixture<OfficeAdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeAdminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
