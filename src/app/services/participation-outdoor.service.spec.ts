import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ParticipationOutdoorService } from './participation-outdoor.service';
import { IChallengeOutdoor, IPartcipationOutdoor, IUser } from '../interfaces';

describe('ParticipationOutdoorService', () => {
  let service: ParticipationOutdoorService;
  let httpMock: HttpTestingController;

  const mockParticipation: IPartcipationOutdoor = {
    participationOutdoorId: 1,
    evidence: 'test-evidence',
    status: "pendiente",
    fechaPublicacion: '2024-07-08',
    challengeOutdoor: {outdoorChallengeId:1} as IChallengeOutdoor,
    user: {id:1} as IUser
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ParticipationOutdoorService],
    });
    service = TestBed.inject(ParticipationOutdoorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update participation', () => {
    const id = 1;
    
    service.updateParticipation(id, mockParticipation).subscribe((response) => {
      expect(response).toEqual(mockParticipation);
    });

    const req = httpMock.expectOne(`${service.source}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockParticipation);
    
    req.flush(mockParticipation); 
  });
});
