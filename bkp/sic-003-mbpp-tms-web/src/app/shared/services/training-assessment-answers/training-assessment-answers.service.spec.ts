import { TestBed } from '@angular/core/testing';

import { TrainingAssessmentAnswersService } from './training-assessment-answers.service';

describe('TrainingAssessmentAnswersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingAssessmentAnswersService = TestBed.get(TrainingAssessmentAnswersService);
    expect(service).toBeTruthy();
  });
});
