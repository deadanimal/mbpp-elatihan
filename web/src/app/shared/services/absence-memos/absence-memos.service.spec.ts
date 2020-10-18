import { TestBed } from '@angular/core/testing';

import { AbsenceMemosService } from './absence-memos.service';

describe('AbsenceMemosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbsenceMemosService = TestBed.get(AbsenceMemosService);
    expect(service).toBeTruthy();
  });
});
