import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IChallengeGame, IBadge, IGame } from './../interfaces/index';
import { ChallengeGameService } from './challenge-game.service';
import Swal from 'sweetalert2';

describe('ChallengeGameService', () => {
  let service: ChallengeGameService;
  let httpMock: HttpTestingController;

  // Datos de prueba
  const mockChallenges: IChallengeGame[] = [
    {
      challengeId: 1,
      title: 'Challenge 1',
      description: 'Description for Challenge 1',
      startDate: new Date('2024-07-17'),
      endDate: new Date('2024-07-18'),
      objectiveScore: 100,
      objectiveTime: 60,
      objectiveFrecuency: 10,
      badgeId: { badgeId: 1 },
      gameId: { gameId: 1}
    },
    {
      challengeId: 2,
      title: 'Challenge 2',
      description: 'Description for Challenge 2',
      startDate: new Date('2024-07-17'),
      endDate: new Date('2025-07-18'),
      objectiveScore: 200,
      objectiveTime: 120,
      objectiveFrecuency: 15,
      badgeId: { badgeId: 2 },
      gameId: { gameId: 2}
    }
  ];

  const mockChallengeToSave: IChallengeGame = {
    challengeId: 3,
    title: 'New Challenge',
    description: 'Description for New Challenge',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-10-31'),
    objectiveScore: 150,
    objectiveTime: 90,
    objectiveFrecuency: 12,
    badgeId: { badgeId: 3 },
    gameId: { gameId: 3 }
  };

  const mockChallengeToUpdate: IChallengeGame = {
    challengeId: 4,
    title: 'Updated Challenge',
    description: 'Updated description',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-09-30'),
    objectiveScore: 175,
    objectiveTime: 100,
    objectiveFrecuency: 14,
    badgeId: { badgeId: 4 },
    gameId: { gameId: 4 }
  };

  const badgeIdToDelete = 2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChallengeGameService]
    });

    service = TestBed.inject(ChallengeGameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all active challenges and update the signal', () => {
    service.getAllActiveChallenges();

    const req = httpMock.expectOne(`${service.source}/active-challenges`);
    expect(req.request.method).toBe('GET');
    req.flush(mockChallenges);

    expect(service.activeChallengeGame$().length).toBe(mockChallenges.length);
  });

  it('should fetch all inactive challenges and update the signal', () => {
    service.getAllInactiveChallenges();

    const req = httpMock.expectOne(`${service.source}/inactive-challenges`);
    expect(req.request.method).toBe('GET');
    req.flush(mockChallenges);

    expect(service.inactiveChallengeGame$().length).toBe(mockChallenges.length);
  });

  it('should save a challenge game and show success alert', () => {
    spyOn(Swal, 'fire').and.callThrough();

    service.save(mockChallengeToSave);

    const req = httpMock.expectOne(`${service.source}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockChallengeToSave);
    req.flush(mockChallengeToSave);

    expect(service.challengeGame$().some(cg => cg.challengeId === mockChallengeToSave.challengeId)).toBeTrue();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'Desafío guardado' }));
  });
});
