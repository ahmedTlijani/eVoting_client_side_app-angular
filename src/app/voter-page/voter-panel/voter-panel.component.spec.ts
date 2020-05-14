import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterPanelComponent } from './voter-panel.component';

describe('VoterPanelComponent', () => {
  let component: VoterPanelComponent;
  let fixture: ComponentFixture<VoterPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoterPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
