import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChallengeGameService } from './challenge-game.service';
import { SweetAlertService } from './sweet-alert-service.service';
import { IChallengeGame } from '../interfaces';

describe('ChallengeGameService', () => {
  let service: ChallengeGameService;
  let httpMock: HttpTestingController;
  let sweetAlertSpy: jasmine.SpyObj<SweetAlertService>;

  const mockChallenge: IChallengeGame = {
    challengeId: 1,
    title: 'Test Challenge',
    description: 'Unit test challenge',
    startDate: new Date(),
    endDate: new Date(),
    objectiveScore: 100,
    objectiveTime: 60,
    objectiveFrecuency: 3,
    badgeId: { id: 1, name: 'Badge Test' } as any, // objeto IBadge simulado
    gameId: { id: 1, name: 'Game Test' } as any, // objeto IGame simulado
  };

  beforeEach(() => {
    const sweetAlertMock = jasmine.createSpyObj('SweetAlertService', [
      'showSuccess',
      'showError',
      'showQuestion'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChallengeGameService,
        { provide: SweetAlertService, useValue: sweetAlertMock }
      ]
    });

    service = TestBed.inject(ChallengeGameService);
    httpMock = TestBed.inject(HttpTestingController);
    sweetAlertSpy = TestBed.inject(SweetAlertService) as jasmine.SpyObj<SweetAlertService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch active challenges successfully', () => {
    const mockResponse = [mockChallenge];

    service.getAllChallengesByStatus('active');

    const req = httpMock.expectOne(`${service.source}/challenges?status=active`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    expect(service.activeChallengeGame$().length).toBe(1);
    expect(service.activeChallengeGame$()[0].title).toBe('Test Challenge');
  });

  it('should handle error when fetching challenges', () => {
    spyOn(console, 'error');
    service.getAllChallengesByStatus('inactive');

    const req = httpMock.expectOne(`${service.source}/challenges?status=inactive`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching inactive challenges',
      jasmine.anything()
    );
  });
});
