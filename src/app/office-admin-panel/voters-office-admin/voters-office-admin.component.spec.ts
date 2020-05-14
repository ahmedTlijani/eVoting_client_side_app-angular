import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotersOfficeAdminComponent } from './voters-office-admin.component';

describe('VotersOfficeAdminComponent', () => {
  let component: VotersOfficeAdminComponent;
  let fixture: ComponentFixture<VotersOfficeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotersOfficeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotersOfficeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
