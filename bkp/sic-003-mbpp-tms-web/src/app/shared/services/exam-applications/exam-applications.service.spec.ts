import { TestBed } from '@angular/core/testing';

import { ExamApplicationsService } from './exam-applications.service';

describe('ExamApplicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExamApplicationsService = TestBed.get(ExamApplicationsService);
    expect(service).toBeTruthy();
  });
});
