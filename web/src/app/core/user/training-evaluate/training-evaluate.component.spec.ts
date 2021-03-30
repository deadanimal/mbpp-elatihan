import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingEvaluateComponent } from './training-evaluate.component';

describe('TrainingEvaluateComponent', () => {
  let component: TrainingEvaluateComponent;
  let fixture: ComponentFixture<TrainingEvaluateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingEvaluateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
