import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterCameraComponent } from './voter-camera.component';

describe('VoterCameraComponent', () => {
  let component: VoterCameraComponent;
  let fixture: ComponentFixture<VoterCameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoterCameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
