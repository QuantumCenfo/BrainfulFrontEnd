import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PuzzleService } from './puzzle.service';
import { of, Subject, throwError } from 'rxjs';

// Minimal interface to satisfy generics used in the service
interface IGameResults {
  id?: string;
  score: number;
  time: number;
}

describe('PuzzleService', () => {
  let service: PuzzleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(PuzzleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRandomImages', () => {
    it('should call Unsplash random photos endpoint and map small URLs', () => {
      const count = 3;
      const mockApiResponse = [
        { urls: { small: 'u1' } },
        { urls: { small: 'u2' } },
        { urls: { small: 'u3' } },
      ];

      let result: string[] | undefined;
      service.getRandomImages(count).subscribe(r => (result = r));

      const req = httpMock.expectOne(req =>
        req.method === 'GET' &&
        req.urlWithParams.startsWith('https://api.unsplash.com/photos/random') &&
        req.urlWithParams.includes('client_id=') &&
        req.urlWithParams.includes(`count=${count}`)
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);

      expect(result).toEqual(['u1', 'u2', 'u3']);
    });

    it('should propagate HTTP error from Unsplash', (done) => {
      const count = 2;

      service.getRandomImages(count).subscribe({
        next: () => done.fail('next should not be called on error'),
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(req => req.method === 'GET' && req.url.includes('/photos/random'));
      req.flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('save', () => {
    it('should call BaseService.add and update resultsListSignal with response at the beginning', () => {
      // Arrange
      const item: IGameResults = { score: 10, time: 50 };
      const responseFromAdd: IGameResults = { id: 'abc', score: 10, time: 50 };

      // Spy on inherited add() (from BaseService) to control its Observable
      const addSubject = new Subject<IGameResults>();
      const addSpy = spyOn(service as any, 'add').and.returnValue(addSubject.asObservable());

      // Spy on the private signal.update call to assert the new state function
      const signalObj = (service as any).resultsListSignal;
      const updateSpy = spyOn(signalObj, 'update').and.callThrough();

      // Act
      service.save(item);
      expect(addSpy).toHaveBeenCalledWith(item);

      // Simulate backend responding
      addSubject.next(responseFromAdd);
      addSubject.complete();

      // Assert that update() was called with a function that prepends the response
      expect(updateSpy).toHaveBeenCalled();
      const updaterFn = updateSpy.calls.mostRecent().args[0] as (prev: IGameResults[]) => IGameResults[];
      const prev = [{ id: 'old', score: 5, time: 30 }] as IGameResults[];
      const next = updaterFn(prev);
      expect(next[0]).toEqual(responseFromAdd);
      expect(next.slice(1)).toEqual(prev);
    });

    it('should log error to console when add() fails', () => {
      const item: IGameResults = { score: 1, time: 2 };
      spyOn(service as any, 'add').and.returnValue(throwError(() => new Error('fail')));
      const consoleSpy = spyOn(console, 'error');

      service.save(item);

      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
