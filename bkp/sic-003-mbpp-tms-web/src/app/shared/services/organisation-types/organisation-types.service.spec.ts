import { TestBed } from '@angular/core/testing';

import { OrganisationTypesService } from './organisation-types.service';

describe('OrganisationTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganisationTypesService = TestBed.get(OrganisationTypesService);
    expect(service).toBeTruthy();
  });
});
