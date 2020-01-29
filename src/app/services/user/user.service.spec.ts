import { TestBed } from '@angular/core/testing';

import { ServicesuseruserService } from './user.service';

describe('ServicesuseruserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicesuseruserService = TestBed.get(ServicesuseruserService);
    expect(service).toBeTruthy();
  });
});
