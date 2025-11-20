import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { GameResultsService } from './game-results.service';

// Interfaces reales según tu modelo
interface IUser {
  userId?: number;
  name?: string;
}

interface IGame {
  gameId?: number;
  name?: string;
}

interface IGameResults {
  resultId?: number;
  gameDate?: string;
  levelDifficulty?: string;
  score?: number;
  time?: number;
  gameId?: IGame;
  userId?: IUser;
}

describe('GameResultsService', () => {
  let service: GameResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GameResultsService);
  });

  // ---------------- getGameResultsByUserId ----------------
  describe('getGameResultsByUserId', () => {
    it('should call findAll(), sort results by score DESC, and set into signal', () => {
      const input: IGameResults[] = [
        { resultId: 1, score: 10, userId: { userId: 1 }, gameId: { gameId: 1 } },
        { resultId: 2, score: 30, userId: { userId: 1 }, gameId: { gameId: 1 } },
        { resultId: 3, score: 20, userId: { userId: 1 }, gameId: { gameId: 1 } },
      ];
      const expected: IGameResults[] = [
        { resultId: 2, score: 30, userId: { userId: 1 }, gameId: { gameId: 1 } },
        { resultId: 3, score: 20, userId: { userId: 1 }, gameId: { gameId: 1 } },
        { resultId: 1, score: 10, userId: { userId: 1 }, gameId: { gameId: 1 } },
      ];

      const findAll$ = new Subject<IGameResults[]>();
      const findAllSpy = spyOn(service as any, 'findAll').and.returnValue(findAll$.asObservable());
      const consoleSpy = spyOn(console, 'log');

      service.getGameResultsByUserId(1);
      expect(findAllSpy).toHaveBeenCalled();

      findAll$.next([...input]);
      findAll$.complete();

      expect(service.gameResults$()).toEqual(expected);
      expect(consoleSpy).toHaveBeenCalledWith('Results:', expected);
    });

    it('should handle empty array: set empty into signal', () => {
      const findAll$ = new Subject<IGameResults[]>();
      spyOn(service as any, 'findAll').and.returnValue(findAll$.asObservable());

      service.getGameResultsByUserId(999);
      findAll$.next([]);
      findAll$.complete();

      expect(service.gameResults$()).toEqual([]);
      expect(service.gameResults$().length).toBe(0);
    });

    it('should handle equal scores without breaking order', () => {
      const a: IGameResults = { resultId: 1, score: 50, userId: { userId: 2 } };
      const b: IGameResults = { resultId: 2, score: 50, userId: { userId: 2 } };
      const input: IGameResults[] = [a, b];

      const findAll$ = new Subject<IGameResults[]>();
      spyOn(service as any, 'findAll').and.returnValue(findAll$.asObservable());

      service.getGameResultsByUserId(2);
      findAll$.next([...input]);
      findAll$.complete();

      const out = service.gameResults$();
      expect(out[0].resultId).toBe(1);
      expect(out[1].resultId).toBe(2);
    });
  });
});
