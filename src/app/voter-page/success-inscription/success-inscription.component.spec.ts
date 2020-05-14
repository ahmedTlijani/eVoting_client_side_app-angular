import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInscriptionComponent } from './success-inscription.component';

describe('SuccessInscriptionComponent', () => {
  let component: SuccessInscriptionComponent;
  let fixture: ComponentFixture<SuccessInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
