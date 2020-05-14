import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainVisualisationComponent } from './blockchain-visualisation.component';

describe('BlockchainVisualisationComponent', () => {
  let component: BlockchainVisualisationComponent;
  let fixture: ComponentFixture<BlockchainVisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchainVisualisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
