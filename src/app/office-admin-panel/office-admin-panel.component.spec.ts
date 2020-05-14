import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeAdminPanelComponent } from './office-admin-panel.component';

describe('OfficeAdminPanelComponent', () => {
  let component: OfficeAdminPanelComponent;
  let fixture: ComponentFixture<OfficeAdminPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeAdminPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
