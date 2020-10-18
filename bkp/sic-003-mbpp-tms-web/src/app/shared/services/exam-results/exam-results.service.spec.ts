import { TestBed } from '@angular/core/testing';

import { ExamResultsService } from './exam-results.service';

describe('ExamResultsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExamResultsService = TestBed.get(ExamResultsService);
    expect(service).toBeTruthy();
  });
});
