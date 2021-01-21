import { TestBed } from '@angular/core/testing';

import { CoresService } from './cores.service';

describe('CoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoresService = TestBed.get(CoresService);
    expect(service).toBeTruthy();
  });
});
