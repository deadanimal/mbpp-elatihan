import { TestBed } from '@angular/core/testing';

import { TrainingNotesService } from './training-notes.service';

describe('TrainingNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingNotesService = TestBed.get(TrainingNotesService);
    expect(service).toBeTruthy();
  });
});
