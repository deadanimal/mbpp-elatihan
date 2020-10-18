import { TestBed } from '@angular/core/testing';

import { TrainingAttendancesService } from './training-attendances.service';

describe('TrainingAttendancesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingAttendancesService = TestBed.get(TrainingAttendancesService);
    expect(service).toBeTruthy();
  });
});
