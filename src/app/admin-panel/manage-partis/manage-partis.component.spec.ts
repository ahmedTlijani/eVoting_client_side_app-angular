import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePartisComponent } from './manage-partis.component';

describe('ManagePartisComponent', () => {
  let component: ManagePartisComponent;
  let fixture: ComponentFixture<ManagePartisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePartisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePartisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
