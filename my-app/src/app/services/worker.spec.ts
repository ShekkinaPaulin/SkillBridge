import { TestBed } from '@angular/core/testing';

import { WorkerService } from './worker';

describe('Worker', () => {
  let service: Worker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Worker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
