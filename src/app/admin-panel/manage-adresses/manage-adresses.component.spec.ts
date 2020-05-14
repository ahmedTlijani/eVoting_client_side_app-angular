import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdressesComponent } from './manage-adresses.component';

describe('ManageAdressesComponent', () => {
  let component: ManageAdressesComponent;
  let fixture: ComponentFixture<ManageAdressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
