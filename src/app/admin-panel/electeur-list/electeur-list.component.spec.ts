import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecteurListComponent } from './electeur-list.component';

describe('ElecteurListComponent', () => {
  let component: ElecteurListComponent;
  let fixture: ComponentFixture<ElecteurListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElecteurListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElecteurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
