import { TestBed } from '@angular/core/testing';

import { AnalysesService } from './analyses.service';

describe('AnalysesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalysesService = TestBed.get(AnalysesService);
    expect(service).toBeTruthy();
  });
});
