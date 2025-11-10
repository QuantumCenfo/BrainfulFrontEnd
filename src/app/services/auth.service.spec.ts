import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

// ---- Minimal local shapes (avoid importing project interfaces/enums)
interface IAuthority { authority: string; }
interface IUser { email?: string; authorities?: IAuthority[]; }

// Simple in-memory localStorage mock
class LocalStorageMock {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.has(k) ? this.store.get(k)! : null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let ls: LocalStorageMock;

  const configure = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  };

  beforeEach(() => {
    // Spy localStorage once before ctor (ctor calls load)
    ls = new LocalStorageMock();
    spyOn(window.localStorage, 'getItem').and.callFake((k: string) => ls.getItem(k));
    spyOn(window.localStorage, 'setItem').and.callFake((k: string, v: string) => ls.setItem(k, v));
    spyOn(window.localStorage, 'removeItem').and.callFake((k: string) => ls.removeItem(k));

    configure();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login() should POST credentials, persist values and emit response (tolerant to token key)', () => {
    const creds = { email: 'john@acme.com', password: 'secret' };
    const resp = {
      accessToken: 'jwt-token-xyz',
      token: 'jwt-token-xyz',
      expiresIn: 7200,
      authUser: { email: 'john@acme.com', authorities: [{ authority: 'admin' }] },
    };

    const saveSpy = spyOn(service as any, 'save').and.callThrough();
    let seen: any;

    service.login(creds).subscribe(r => (seen = r));

    const req = httpMock.expectOne(r => r.method === 'POST' && r.url === 'auth/login');
    expect(req.request.body).toEqual(creds);
    req.flush(resp);

    // Response emitted
    expect(seen).toEqual(resp);

    // Side-effects: at least user & expiry saved
    expect(window.localStorage.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify(resp.authUser));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('expiresIn', JSON.stringify(7200));
    expect(saveSpy).toHaveBeenCalled();

    // Internal token should not be empty
    const token = (service as any).accessToken;
    expect(token).toBeTruthy();
  });

  it('should save() to localStorage and load() on a new instance (tolerant to quoted values)', () => {
    (service as any).accessToken = 'abc123';
    (service as any).expiresIn = 3600;
    (service as any).user = { email: 'test@acme.com', authorities: [{ authority: 'user' }] } as IUser;

    service.save();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify((service as any).user));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('access_token', JSON.stringify('abc123'));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('expiresIn', JSON.stringify(3600));

    // Reset DI graph (do NOT re-spy localStorage)
    TestBed.resetTestingModule();
    configure();

    // load() called by constructor
    expect(service.getUser()).toEqual({ email: 'test@acme.com', authorities: [{ authority: 'user' }] });

    const raw = (service as any).accessToken;
    const normalized = raw && raw.startsWith('"') ? JSON.parse(raw) : raw;
    expect(normalized).toBe('abc123');
    expect(service.check()).toBeTrue();
  });

  describe('roles & permissions', () => {
    beforeEach(() => {
      (service as any).user = {
        email: 'r@acme.com',
        authorities: [
          { authority: 'user' },
          { authority: 'admin' },
          { authority: 'ROLE_ADMIN' }, // compatibility with Spring-style roles
          { authority: 'read' },
        ],
      } as IUser;
    });

    it('areActionsAvailable returns true only if any routeAuthorities AND admin/superAdmin', () => {
      // Should be true because user has 'read' and is admin
      expect(service.areActionsAvailable(['write', 'read'])).toBeTrue();

      // Should be false because user lacks 'write'
      expect(service.areActionsAvailable(['write'])).toBeFalse();

      // Should be false because user not admin/superAdmin
      (service as any).user = { email: 'user@acme.com', authorities: [{ authority: 'read' }] } as IUser;
      expect(service.areActionsAvailable(['read'])).toBeFalse();
    });
  });

  it('getPermittedRoutes includes only matching authorities preserving unshift order', () => {
    (service as any).user = {
      email: 'a@b.c',
      authorities: [{ authority: 'user' }, { authority: 'report' }],
    } as IUser;

    const routes = [
      { path: 'home' },
      { path: 'admin', data: { authorities: ['admin'] } },
      { path: 'reports', data: { authorities: ['report'] } },
      { path: 'profile', data: { authorities: ['user'] } },
    ];

    const permitted = service.getPermittedRoutes(routes);
    expect(permitted.map(r => r.path)).toEqual(['profile', 'reports']);
  });

  it('logout clears token and removes related storage keys', () => {
    (service as any).accessToken = 'tkn';
    service.logout();

    expect((service as any).accessToken).toBe('');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('access_token');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('expiresIn');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_user');
  });
});
