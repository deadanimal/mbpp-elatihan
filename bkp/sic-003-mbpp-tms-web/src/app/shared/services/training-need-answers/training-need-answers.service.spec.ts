import { TestBed } from '@angular/core/testing';

import { TrainingNeedAnswersService } from './training-need-answers.service';

describe('TrainingNeedAnswersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingNeedAnswersService = TestBed.get(TrainingNeedAnswersService);
    expect(service).toBeTruthy();
  });
});
