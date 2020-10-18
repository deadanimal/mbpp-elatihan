import { TestBed } from '@angular/core/testing';

import { TrainingApplicationsService } from './training-applications.service';

describe('TrainingApplicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingApplicationsService = TestBed.get(TrainingApplicationsService);
    expect(service).toBeTruthy();
  });
});
