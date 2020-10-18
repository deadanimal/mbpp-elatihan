import { TestBed } from '@angular/core/testing';

import { TrainingCodeClassService } from './training-code-class.service';

describe('TrainingCodeClassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingCodeClassService = TestBed.get(TrainingCodeClassService);
    expect(service).toBeTruthy();
  });
});
