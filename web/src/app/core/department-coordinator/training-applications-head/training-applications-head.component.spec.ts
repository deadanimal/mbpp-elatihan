import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingApplicationsHeadComponent } from './training-applications-head.component';

describe('TrainingApplicationsHeadComponent', () => {
  let component: TrainingApplicationsHeadComponent;
  let fixture: ComponentFixture<TrainingApplicationsHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingApplicationsHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingApplicationsHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
