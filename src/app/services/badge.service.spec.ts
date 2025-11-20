import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, Subject, throwError } from 'rxjs';
import { BadgeService } from './badge.service';
import { SweetAlertService } from './sweet-alert-service.service';

interface IBadge {
  badgeId?: number;
  title?: string;
  description?: string;
  url?: string;
}

// Mock del servicio de SweetAlert
class SweetAlertServiceMock {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
  showQuestion = jasmine.createSpy('showQuestion').and.callFake(() => Promise.resolve({ isConfirmed: true }));
}

describe('BadgeService', () => {
  let service: BadgeService;
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

    sweet = TestBed.inject(SweetAlertService) as any;
    service = TestBed.inject(BadgeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    });
// ---------------- getAllBadges ----------------
describe('getAllBadges', () => {
  it('should call findAll() and set reversed results into badgeSignal', () => {
    // Prepara input y expected ANTES de emitir
    const input: IBadge[] = [
      { badgeId: 1, title: 'A', description: 'desc1', url: 'url1' },
      { badgeId: 2, title: 'B', description: 'desc2', url: 'url2' },
    ];
    const expected: IBadge[] = [
      { badgeId: 2, title: 'B', description: 'desc2', url: 'url2' },
      { badgeId: 1, title: 'A', description: 'desc1', url: 'url1' },
    ];

    const findAll$ = new Subject<IBadge[]>();
    const findAllSpy = spyOn(service as any, 'findAll').and.returnValue(findAll$.asObservable());

    service.getAllBadges();
    expect(findAllSpy).toHaveBeenCalled();

    // Envía una COPIA para que reverse() no mute 'input' del test
    findAll$.next([...input]);
    findAll$.complete();

    expect(service.badgeSignal()).toEqual(expected);
    expect(service.badgeSignal().length).toBe(2);
    expect(service.badgeSignal()[0].title).toBe('B');
    expect(service.badgeSignal()[1].title).toBe('A');
  });

  it('should log error when findAll() errors', () => {
    spyOn(service as any, 'findAll').and.returnValue(throwError(() => new Error('fail')));
    const consoleSpy = spyOn(console, 'error');

    service.getAllBadges();

    expect(consoleSpy).toHaveBeenCalled();
  });
});


  // ---------------- addBadge / handleAddBadge ----------------
  describe('addBadge / handleAddBadge', () => {
    it('addBadge should POST FormData to source endpoint', () => {
      const badge: IBadge = { title: 'New', description: 'Badge test', url: 'img.png' };
      const file = new File(['xyz'], 'image.png', { type: 'image/png' });

      let resp: any;
      service.addBadge(badge, file).subscribe(r => (resp = r));

      const req = httpMock.expectOne((r) => r.method === 'POST' && r.url === 'badges');
      const body = req.request.body as FormData;

      expect(body instanceof FormData).toBeTrue();
      expect(body.has('badge')).toBeTrue();
      expect(body.has('image')).toBeTrue();
      expect(req.request.headers.keys().length).toBe(0); // headers vacíos

      req.flush({ ok: true, id: 123 });
      expect(resp).toEqual({ ok: true, id: 123 });
    });

    it('handleAddBadge should prepend response into signal and call showSuccess', () => {
      const initial: IBadge[] = [{ badgeId: 10, title: 'Old', description: 'desc', url: 'url' }];
      (service as any).badgeSignal.set(initial);

      const badge: IBadge = { title: 'New Badge', description: 'desc', url: 'new.png' };
      const file = new File(['xyz'], 'image.png', { type: 'image/png' });
      const apiResp: IBadge = { badgeId: 99, title: 'New Badge', description: 'desc', url: 'new.png' };

      spyOn(service, 'addBadge').and.returnValue(of(apiResp));

      service.handleAddBadge(badge, file);

      expect(service.badgeSignal()[0]).toEqual(apiResp);
      expect(service.badgeSignal().slice(1)).toEqual(initial);
      expect(sweet.showSuccess).toHaveBeenCalled();
    });

    it('handleAddBadge should call showError on failure', () => {
      const badge: IBadge = { title: 'Error Badge', description: 'desc', url: 'err.png' };
      const file = new File(['xyz'], 'image.png', { type: 'image/png' });
      spyOn(service, 'addBadge').and.returnValue(throwError(() => new Error('boom')));

      service.handleAddBadge(badge, file);

      expect(sweet.showError).toHaveBeenCalled();
    });
  });

  // ---------------- updateBadge / handleUpdateBadge ----------------
  describe('updateBadge / handleUpdateBadge', () => {
    it('updateBadge should PUT FormData to badges/{id}', () => {
      const badge: IBadge = { badgeId: 7, title: 'Update', description: 'desc', url: 'img.png' };
      const file = new File(['x'], 'img.png', { type: 'image/png' });

      let resp: any;
      service.updateBadge(badge, file).subscribe(r => (resp = r));

      const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === `badges/${badge.badgeId}`);
      const body = req.request.body as FormData;

      expect(body instanceof FormData).toBeTrue();
      expect(body.has('badge')).toBeTrue();
      expect(body.has('image')).toBeTrue();

      req.flush({ ok: true });
      expect(resp).toEqual({ ok: true });
    });

    it('handleUpdateBadge should confirm, update signal and call showSuccess', async () => {
      const initial: IBadge[] = [
        { badgeId: 1, title: 'A', description: 'd1', url: 'u1' },
        { badgeId: 2, title: 'B', description: 'd2', url: 'u2' },
      ];
      (service as any).badgeSignal.set(initial);

      const updated: IBadge = { badgeId: 2, title: 'B Updated', description: 'new', url: 'u3' };
      spyOn(service, 'updateBadge').and.returnValue(of(updated));

      (sweet.showQuestion as any).and.returnValue(Promise.resolve({ isConfirmed: true }));

      await service.handleUpdateBadge(updated, new File(['x'], 'a.png'));
      await Promise.resolve();

      const list = service.badgeSignal();
      expect(list.find(b => b.badgeId === 2)).toEqual(updated);
      expect(sweet.showSuccess).toHaveBeenCalled();
    });

    it('handleUpdateBadge should do nothing when not confirmed', async () => {
      const initial: IBadge[] = [{ badgeId: 1, title: 'A', description: 'desc', url: 'url' }];
      (service as any).badgeSignal.set(initial);

      (sweet.showQuestion as any).and.returnValue(Promise.resolve({ isConfirmed: false }));
      const updateSpy = spyOn(service, 'updateBadge');

      await service.handleUpdateBadge({ badgeId: 1, title: 'Ax', description: 'x', url: 'url2' }, new File(['x'], 'a.png'));

      expect(updateSpy).not.toHaveBeenCalled();
      expect(service.badgeSignal()).toEqual(initial);
    });
  });

  // ---------------- deleteBadge ----------------
  describe('deleteBadge', () => {
    it('should delete after confirmation, update signal and show success', async () => {
      const initial: IBadge[] = [
        { badgeId: 1, title: 'A', description: 'd1', url: 'u1' },
        { badgeId: 2, title: 'B', description: 'd2', url: 'u2' },
      ];
      (service as any).badgeSignal.set(initial);

      (sweet.showQuestion as any).and.returnValue(Promise.resolve({ isConfirmed: true }));
      const delSubject = new Subject<void>();
      const delSpy = spyOn(service as any, 'del').and.returnValue(delSubject.asObservable());

      service.deleteBadge(2);

      // Espera a que se resuelva el then() de showQuestion
      await Promise.resolve();

      expect(delSpy).toHaveBeenCalledWith(2);

      // Simula backend OK y espera a que procese el subscribe
      delSubject.next();
      delSubject.complete();
      await Promise.resolve();

      expect(service.badgeSignal().some(b => b.badgeId === 2)).toBeFalse();
      expect(sweet.showSuccess).toHaveBeenCalled();
    });

    it('should showError when backend delete fails', async () => {
      (sweet.showQuestion as any).and.returnValue(Promise.resolve({ isConfirmed: true }));
      spyOn(service as any, 'del').and.returnValue(throwError(() => new Error('fail')));

      service.deleteBadge(999);
      await Promise.resolve();

      expect(sweet.showError).toHaveBeenCalled();
    });

    it('should not call del when not confirmed', async () => {
      (sweet.showQuestion as any).and.returnValue(Promise.resolve({ isConfirmed: false }));
      const delSpy = spyOn(service as any, 'del');

      service.deleteBadge(1);
      await Promise.resolve();

      expect(delSpy).not.toHaveBeenCalled();
    });
  });
});