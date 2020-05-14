import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecteurPieChartComponent } from './electeur-pie-chart.component';

describe('ElecteurPieChartComponent', () => {
  let component: ElecteurPieChartComponent;
  let fixture: ComponentFixture<ElecteurPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElecteurPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElecteurPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
