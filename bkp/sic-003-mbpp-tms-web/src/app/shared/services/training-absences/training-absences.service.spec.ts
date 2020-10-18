import { TestBed } from '@angular/core/testing';

import { TrainingAbsencesService } from './training-absences.service';

describe('TrainingAbsencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingAbsencesService = TestBed.get(TrainingAbsencesService);
    expect(service).toBeTruthy();
  });
});
