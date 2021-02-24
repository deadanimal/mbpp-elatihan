import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingApplicationsComponent } from './training-applications.component';

describe('TrainingApplicationsComponent', () => {
  let component: TrainingApplicationsComponent;
  let fixture: ComponentFixture<TrainingApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
