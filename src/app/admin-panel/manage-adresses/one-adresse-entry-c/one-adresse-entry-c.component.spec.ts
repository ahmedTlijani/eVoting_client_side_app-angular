import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneAdresseEntryCComponent } from './one-adresse-entry-c.component';

describe('OneAdresseEntryCComponent', () => {
  let component: OneAdresseEntryCComponent;
  let fixture: ComponentFixture<OneAdresseEntryCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneAdresseEntryCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneAdresseEntryCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
