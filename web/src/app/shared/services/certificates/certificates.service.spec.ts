import { TestBed } from '@angular/core/testing';

import { CertificatesService } from './certificates.service';

describe('CertificatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CertificatesService = TestBed.get(CertificatesService);
    expect(service).toBeTruthy();
  });
});
