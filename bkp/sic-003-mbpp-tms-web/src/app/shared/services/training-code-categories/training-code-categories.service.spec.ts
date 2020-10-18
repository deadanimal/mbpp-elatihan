import { TestBed } from '@angular/core/testing';

import { TrainingCodeCategoriesService } from './training-code-categories.service';

describe('TrainingCodeCategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingCodeCategoriesService = TestBed.get(TrainingCodeCategoriesService);
    expect(service).toBeTruthy();
  });
});
