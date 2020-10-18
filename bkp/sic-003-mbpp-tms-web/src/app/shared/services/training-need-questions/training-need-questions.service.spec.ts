import { TestBed } from '@angular/core/testing';

import { TrainingNeedQuestionsService } from './training-need-questions.service';

describe('TrainingNeedQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingNeedQuestionsService = TestBed.get(TrainingNeedQuestionsService);
    expect(service).toBeTruthy();
  });
});
