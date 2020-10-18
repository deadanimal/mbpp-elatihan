import { TestBed } from '@angular/core/testing';

import { SecurityQuestionsService } from './security-questions.service';

describe('SecurityQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecurityQuestionsService = TestBed.get(SecurityQuestionsService);
    expect(service).toBeTruthy();
  });
});
