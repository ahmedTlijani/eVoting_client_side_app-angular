import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticaleEffectComponent } from './particale-effect.component';

describe('ParticaleEffectComponent', () => {
  let component: ParticaleEffectComponent;
  let fixture: ComponentFixture<ParticaleEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticaleEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticaleEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
