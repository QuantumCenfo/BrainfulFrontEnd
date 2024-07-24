import { TestBed } from '@angular/core/testing';

import { ChallengeOutdoorService } from './challenge-outdoor.service';

describe('ChallengeOutdoorService', () => {
  let service: ChallengeOutdoorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallengeOutdoorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
