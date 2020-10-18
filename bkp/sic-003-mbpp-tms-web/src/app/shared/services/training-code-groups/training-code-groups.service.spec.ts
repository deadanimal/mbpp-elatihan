import { TestBed } from '@angular/core/testing';

import { TrainingCodeGroupsService } from './training-code-groups.service';

describe('TrainingCodeGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingCodeGroupsService = TestBed.get(TrainingCodeGroupsService);
    expect(service).toBeTruthy();
  });
});
