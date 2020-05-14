import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAdminPageComponent } from './result-admin-page.component';

describe('ResultAdminPageComponent', () => {
  let component: ResultAdminPageComponent;
  let fixture: ComponentFixture<ResultAdminPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultAdminPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
