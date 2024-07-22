import { TestBed } from '@angular/core/testing';

import { ParticipationOutdoorService } from './participation-outdoor.service';

describe('ParticipationOutdoorService', () => {
  let service: ParticipationOutdoorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipationOutdoorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
