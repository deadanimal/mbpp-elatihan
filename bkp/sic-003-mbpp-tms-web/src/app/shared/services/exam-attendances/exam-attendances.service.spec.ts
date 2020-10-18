import { TestBed } from '@angular/core/testing';

import { ExamAttendancesService } from './exam-attendances.service';

describe('ExamAttendancesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExamAttendancesService = TestBed.get(ExamAttendancesService);
    expect(service).toBeTruthy();
  });
});
