import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { MemoryBoardComponent } from './memory-board.component';
import { MemoryService } from '../../services/memory.service';
import { SweetAlertService } from '../../services/sweet-alert-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// ====== Mocks / Stubs ======
class MemoryServiceMock {
  getRandomImages = jasmine.createSpy('getRandomImages').and.returnValue(of(['imgA', 'imgB', 'imgC']));
  save = jasmine.createSpy('save');
}
class SweetAlertServiceMock {
  showdifficultyWarning = jasmine.createSpy('showdifficultyWarning');
}
class NgbModalMock {
  open() {
    return { componentInstance: {}, result: Promise.resolve('tryAgain') };
  }
}
// TimerComponent stub
class TimerStub {
  elapsedTime = 42;
  stopTimer = jasmine.createSpy('stopTimer');
  timer = jasmine.createSpy('timer');
}
function makeCard(url: string) {
  return { cardImageUrl: url, isMatched: false, isFlipped: true } as any;
}

describe('MemoryBoardComponent (standalone)', () => {
  let fixture: any;
  let component: MemoryBoardComponent;

  let memorySvc: MemoryServiceMock;
  let alertSvc: SweetAlertServiceMock;
  let router: Router;

  const activatedRouteStub = {
    paramMap: of({ get: (k: string) => (k === 'gameId' ? '5' : null) }),
  };

  // Helper que garantiza que timerComponent exista (reasigna por si Angular lo pisa)
  function ensureTimerStub() {
    if (!(component as any).timerComponent) {
      (component as any).timerComponent = new TimerStub() as any;
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryBoardComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MemoryService, useClass: MemoryServiceMock },
        { provide: SweetAlertService, useClass: SweetAlertServiceMock },
        { provide: NgbModal, useClass: NgbModalMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .overrideComponent(MemoryBoardComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(MemoryBoardComponent);
    component = fixture.componentInstance;

    memorySvc = TestBed.inject(MemoryService) as any;
    alertSvc = TestBed.inject(SweetAlertService) as any;
    router = TestBed.inject(Router);

    // Mock router.events (getter)
    const routerEvents$ = new Subject<any>();
    spyOnProperty(router, 'events', 'get').and.returnValue(routerEvents$.asObservable());

    // localStorage para getUserIdFromLocalStorage()
    spyOn(window.localStorage, 'getItem').and.callFake((k: string) =>
      k === 'auth_user' ? JSON.stringify({ id: 77, email: 'u@acme.com' }) : null
    );

    // detectChanges y aseguramos TimerStub
    fixture.detectChanges();
    ensureTimerStub();
  });

  it('should create and read gameId from route', () => {
    expect(component).toBeTruthy();
    component.ngOnInit?.();
    expect(component.gameId).toBe(5);
  });

  it('startGame with difficulty 6 should init, set timer(30), get images and build pairs', () => {
    ensureTimerStub();
    component.difficulty = 6;
    component.startGame();

    expect((component as any).timerComponent.timer).toHaveBeenCalledWith(30);
    expect(memorySvc.getRandomImages).toHaveBeenCalledWith(6);
    expect(component.cards.length).toBe(6);
    const counts = component.cards.reduce((m: any, url) => ((m[url] = (m[url] || 0) + 1), m), {});
    expect(Object.values(counts)).toEqual([2, 2, 2]); // 3 pares
  });

  it('startGame with difficulty 9 should call timer(60); with 12 → timer(90)', () => {
    ensureTimerStub();
    component.difficulty = 9;
    component.startGame();
    expect((component as any).timerComponent.timer).toHaveBeenCalledWith(60);

    component.startOver();
    (component as any).timerComponent.timer.calls.reset();

    ensureTimerStub();
    component.difficulty = 12;
    component.startGame();
    expect((component as any).timerComponent.timer).toHaveBeenCalledWith(90);
  });

  it('startGame with difficulty 0 should show warning and not run', () => {
    component.difficulty = 0;
    component.startGame();

    expect(alertSvc.showdifficultyWarning).toHaveBeenCalledWith(
      'Ooops...',
      'Seleccione una dificultad antes de comenzar el juego.'
    );
    expect(component.isGameRunning).toBeFalse();
    expect(component.gameStarted).toBeFalse();
  });

  it('checkForMatch: matching cards should add 10 points, mark matched and push to matchedCards', () => {
    const c1 = makeCard('same'); const c2 = makeCard('same');
    component.points = 0;
    component.flippedCards = [c1, c2];

    spyOn(component as any, 'playSound');
    spyOn(component, 'checkForWin');

    component.checkForMatch();

    expect((component as any).playSound).toHaveBeenCalledWith('Correct');
    expect(component.points).toBe(10);
    expect(component.matchedCards.length).toBe(2);
    expect(component.checkForWin).toHaveBeenCalled();
    expect(component.flippedCards.length).toBe(0);
  });

  it('checkForMatch: mismatching cards should subtract points and unflip after 1s', fakeAsync(() => {
    const c1 = makeCard('A'); const c2 = makeCard('B');
    component.points = 10;
    component.flippedCards = [c1, c2];
    spyOn(component as any, 'playSound');

    component.checkForMatch();
    tick(1000);

    expect((component as any).playSound).toHaveBeenCalledWith('Wrong2');
    expect(c1.isFlipped).toBeFalse();
    expect(c2.isFlipped).toBeFalse();
    expect(component.points).toBe(5);
    expect(component.flippedCards.length).toBe(0);
  }));

  it('checkForWin should call gatherDataAndSave + showVictoryAlert when all matched', () => {
    ensureTimerStub();
    component.cards = ['x', 'x'];
    const c1 = makeCard('x'); c1.isMatched = true;
    const c2 = makeCard('x'); c2.isMatched = true;
    component.matchedCards = [c1, c2];

    spyOn(component as any, 'gatherDataAndSave');
    spyOn(component, 'showVictoryAlert');

    component.checkForWin();

    expect((component as any).gatherDataAndSave).toHaveBeenCalledWith((component as any).timerComponent.elapsedTime);
    expect(component.showVictoryAlert).toHaveBeenCalled();
  });

  it('gatherDataAndSave should build results and call memoryService.save', () => {
    component.difficulty = 6;
    component.points = 25;
    component.gameId = 123;

    (component as any).gatherDataAndSave(99);

    expect(memorySvc.save).toHaveBeenCalled();
    const payload = memorySvc.save.calls.mostRecent().args[0];
    expect(payload.levelDifficulty).toBe('Facil');
    expect(payload.score).toBe(25);
    expect(payload.time).toBe(99);
    expect(payload.gameId).toEqual({ gameId: 123 });
    expect(payload.userId).toEqual({ id: 77 });
  });

  it('endGame should stop timer, start over and on "tryAgain" call startGame()', fakeAsync(async () => {
    ensureTimerStub();
    const modalOpenSpy = spyOn(TestBed.inject(NgbModal) as any, 'open').and.callThrough();
    const startGameSpy = spyOn(component, 'startGame');

    component.endGame();

    expect((component as any).timerComponent.stopTimer).toHaveBeenCalled();
    await modalOpenSpy.calls.mostRecent().returnValue.result; // tryAgain
    expect(startGameSpy).toHaveBeenCalled();
  }));

  it('endGame should navigate to ["app/games"] when modal returns "goToAnotherView"', fakeAsync(async () => {
    ensureTimerStub();
    const modal = TestBed.inject(NgbModal) as any;
    spyOn(modal, 'open').and.returnValue({ componentInstance: {}, result: Promise.resolve('goToAnotherView') });
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);

    component.endGame();
    await modal.open.calls.mostRecent().returnValue.result;

    expect(navSpy).toHaveBeenCalledWith(['app/games']);
  }));

  it('generateCardPairs should duplicate and shuffle input images', () => {
    const out = component.generateCardPairs(['a', 'b']);
    expect(out.length).toBe(4);
    const counts = out.reduce((m: any, url) => ((m[url] = (m[url] || 0) + 1), m), {});
    expect(counts['a']).toBe(2);
    expect(counts['b']).toBe(2);
  });

  it('startOver should reset state', () => {
    component.started = true;
    component.points = 50;
    component.flippedCards = [makeCard('x')];
    component.matchedCards = [makeCard('y')];

    component.startOver();

    expect(component.started).toBeFalse();
    expect(component.points).toBe(0);
    expect(component.flippedCards.length).toBe(0);
    expect(component.matchedCards.length).toBe(0);
  });
});
