import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingHistoriesComponent } from './training-histories.component';

describe('TrainingHistoriesComponent', () => {
  let component: TrainingHistoriesComponent;
  let fixture: ComponentFixture<TrainingHistoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingHistoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
