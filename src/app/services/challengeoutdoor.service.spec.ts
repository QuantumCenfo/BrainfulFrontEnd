import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Subject, throwError } from 'rxjs';
import { ChallengeOutdoorService } from './challenge-outdoor.service';
import { SweetAlertService } from './sweet-alert-service.service';

// ---- Interfaz real según el proyecto ----
interface IBadge {
  badgeId?: number;
  title?: string;
  description?: string;
  url?: string;
}

interface IChallengeOutdoor {
  outdoorChallengeId?: number;
  requirement?: string;
  description?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  badgeId?: IBadge;
}

// ---- SweetAlert mock ----
class SweetAlertServiceMock {
  // Devolvemos un "thenable" inerte para no ejecutar window.location.reload()
  showSuccess = jasmine.createSpy('showSuccess').and.returnValue({ then: (_cb?: any) => {} } as any);
  showError   = jasmine.createSpy('showError')  .and.returnValue({ then: (_cb?: any) => {} } as any);
}

describe('ChallengeOutdoorService', () => {
  let service: ChallengeOutdoorService;
  let httpMock: HttpTestingController;
  let sweet: SweetAlertServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SweetAlertService, useClass: SweetAlertServiceMock },
      ],
    });

    service = TestBed.inject(ChallengeOutdoorService);
    httpMock = TestBed.inject(HttpTestingController);
    sweet = TestBed.inject(SweetAlertService) as any;
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ---------------- getAllChallengesByStatus ----------------
  describe('getAllChallengesByStatus', () => {
    it('should GET active challenges, reverse them and set activeChallengeOutdoorSignal', () => {
      const input: IChallengeOutdoor[] = [
        { outdoorChallengeId: 1, name: 'A', description: 'd1' },
        { outdoorChallengeId: 2, name: 'B', description: 'd2' },
      ];
      const expected: IChallengeOutdoor[] = [
        { outdoorChallengeId: 2, name: 'B', description: 'd2' },
        { outdoorChallengeId: 1, name: 'A', description: 'd1' },
      ];

      service.getAllChallengesByStatus('active');

      // ✅ URL completa con query correcto
      const req = httpMock.expectOne('challengeOutdoor/challenges?status=active');
      req.flush([...input]); // copia para que reverse() no mute el array del test

      expect(service.activeChallengeOutdoor$()).toEqual(expected);
      expect(service.inactiveChallengeOutdoor$().length).toBe(0);
    });

    it('should GET inactive challenges, reverse them and set inactiveChallengeOutdoorSignal', () => {
      const input: IChallengeOutdoor[] = [
        { outdoorChallengeId: 10, name: 'X', description: 'dx' },
        { outdoorChallengeId: 11, name: 'Y', description: 'dy' },
      ];
      const expected: IChallengeOutdoor[] = [
        { outdoorChallengeId: 11, name: 'Y', description: 'dy' },
        { outdoorChallengeId: 10, name: 'X', description: 'dx' },
      ];

      service.getAllChallengesByStatus('inactive');

      // ✅ URL completa con query correcto (no usar r.params porque el query está en la URL)
      const req = httpMock.expectOne('challengeOutdoor/challenges?status=inactive');
      req.flush([...input]);

      expect(service.inactiveChallengeOutdoor$()).toEqual(expected);
      expect(service.activeChallengeOutdoor$().length).toBe(0);
    });

    it('should log error when backend fails', () => {
      const consoleSpy = spyOn(console, 'error');

      service.getAllChallengesByStatus('active');
      const req = httpMock.expectOne(r => r.method === 'GET');
      req.flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // ---------------- save (uses BaseService.add) ----------------
  describe('save', () => {
    it('should call add, prepend response into signal and showSuccess', async () => {
      const item: IChallengeOutdoor = { outdoorChallengeId: 0, name: 'New', description: 'desc' };
      const initial: IChallengeOutdoor[] = [ { outdoorChallengeId: 5, name: 'Old', description: 'd' } ];
      (service as any).challengeOutdoorSignal.set(initial);

      const addSubject = new Subject<IChallengeOutdoor>();
      const addSpy = spyOn(service as any, 'add').and.returnValue(addSubject.asObservable());

      service.save(item);
      expect(addSpy).toHaveBeenCalledWith(item);

      // Simula backend responde
      const apiResp: IChallengeOutdoor = { outdoorChallengeId: 123, name: 'New', description: 'desc' };
      addSubject.next(apiResp);
      addSubject.complete();

      // Deja procesar el subscribe y la promesa del thenable inerte
      await Promise.resolve();
      await Promise.resolve();

      const current: IChallengeOutdoor[] = (service as any).challengeOutdoorSignal();
      expect(current[0]).toEqual(apiResp);
      expect(sweet.showSuccess).toHaveBeenCalled();
    });

    it('should showError on add error', async () => {
      const item: IChallengeOutdoor = { outdoorChallengeId: 0, name: 'Err', description: 'd' };
      spyOn(service as any, 'add').and.returnValue(throwError(() => new Error('fail')));

      service.save(item);

      await Promise.resolve();
      await Promise.resolve();

      expect(sweet.showError).toHaveBeenCalled();
    });
  });

  // ---------------- updateDateChallengeOutdoor (uses BaseService.edit) ----------------
  describe('updateDateChallengeOutdoor', () => {
    it('should call edit, replace updated item in signal and showSuccess', async () => {
      const list: IChallengeOutdoor[] = [
        { outdoorChallengeId: 1, name: 'A' },
        { outdoorChallengeId: 2, name: 'B' },
      ];
      (service as any).challengeOutdoorSignal.set(list);

      const edited: IChallengeOutdoor = { outdoorChallengeId: 2, name: 'B*' };

      const editSubject = new Subject<IChallengeOutdoor>();
      const editSpy = spyOn(service as any, 'edit').and.returnValue(editSubject.asObservable());

      service.updateDateChallengeOutdoor(edited);
      expect(editSpy).toHaveBeenCalledWith(2, edited);

      editSubject.next(edited);
      editSubject.complete();

      await Promise.resolve();
      await Promise.resolve();

      const current: IChallengeOutdoor[] = (service as any).challengeOutdoorSignal();
      expect(current.find((c: IChallengeOutdoor) => c.outdoorChallengeId === 2)).toEqual(edited);
      expect(sweet.showSuccess).toHaveBeenCalled();
    });

    it('should showError on edit error', async () => {
      spyOn(service as any, 'edit').and.returnValue(throwError(() => new Error('fail')));

      service.updateDateChallengeOutdoor({ outdoorChallengeId: 9, name: 'X' });

      await Promise.resolve();
      await Promise.resolve();

      expect(sweet.showError).toHaveBeenCalled();
    });
  });
});
