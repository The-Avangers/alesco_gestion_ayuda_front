import { TestBed } from '@angular/core/testing';

import { AidService } from './aid.service';

describe('AidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AidService = TestBed.get(AidService);
    expect(service).toBeTruthy();
  });
});
