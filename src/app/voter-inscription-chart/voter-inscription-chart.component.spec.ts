import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterInscriptionChartComponent } from './voter-inscription-chart.component';

describe('VoterInscriptionChartComponent', () => {
  let component: VoterInscriptionChartComponent;
  let fixture: ComponentFixture<VoterInscriptionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoterInscriptionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterInscriptionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
