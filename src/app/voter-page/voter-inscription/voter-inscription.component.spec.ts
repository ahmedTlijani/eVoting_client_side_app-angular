import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterInscriptionComponent } from './voter-inscription.component';

describe('VoterInscriptionComponent', () => {
  let component: VoterInscriptionComponent;
  let fixture: ComponentFixture<VoterInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoterInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
