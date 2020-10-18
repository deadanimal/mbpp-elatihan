import { TestBed } from '@angular/core/testing';

import { AttendancesService } from './attendances.service';

describe('AttendancesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttendancesService = TestBed.get(AttendancesService);
    expect(service).toBeTruthy();
  });
});
