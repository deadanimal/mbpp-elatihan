import { TestBed } from '@angular/core/testing';

import { TrainingAssessmentQuestionsService } from './training-assessment-questions.service';

describe('TrainingAssessmentQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingAssessmentQuestionsService = TestBed.get(TrainingAssessmentQuestionsService);
    expect(service).toBeTruthy();
  });
});
