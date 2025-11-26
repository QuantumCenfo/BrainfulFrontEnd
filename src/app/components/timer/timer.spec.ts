import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { TimerComponent } from './timer.component';

describe('TimerComponent (standalone)', () => {
  let fixture: ComponentFixture<TimerComponent>;
  let component: TimerComponent;

  // Mock de Date.now controlable
  let nowMs: number;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerComponent],
    })
      // Evitamos depender del template real
      .overrideComponent(TimerComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;

    // Espiamos Date.now con valor controlable
    nowMs = 0;
    spyOn(Date, 'now').and.callFake(() => nowMs);

    fixture.detectChanges();
  });

  afterEach(() => {
    // Cinturón y tirantes: evita fugas entre tests
    try { component.stopTimer(); } catch {}
    try { discardPeriodicTasks(); } catch {}
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.timeLeft).toBe(0);
    expect(component.elapsedTime).toBe(0);
  });

  it('timer() should start from given seconds and decrease timeLeft each second', fakeAsync(() => {
    component.timer(3); // 3 segundos
    expect(component.timeLeft).toBe(3);
    expect(component.elapsedTime).toBe(0);

    nowMs = 1000; tick(1000);
    expect(component.elapsedTime).toBe(1);
    expect(component.timeLeft).toBe(2);

    nowMs = 2000; tick(1000);
    expect(component.elapsedTime).toBe(2);
    expect(component.timeLeft).toBe(1);

    nowMs = 3000; tick(1000);
    expect(component.elapsedTime).toBe(3);
    expect(component.timeLeft).toBe(0);
  }));

  it('should emit timerEnded exactly once when reaches zero', fakeAsync(() => {
    const endedSpy = jasmine.createSpy('ended');
    component.timerEnded.subscribe(endedSpy);

    component.timer(2);

    nowMs = 1000; tick(1000);
    expect(endedSpy).not.toHaveBeenCalled();

    nowMs = 2000; tick(1000);
    expect(endedSpy).toHaveBeenCalledTimes(1);

    // Aunque sigamos avanzando, no debe volver a emitir
    nowMs = 3000; tick(1000);
    expect(endedSpy).toHaveBeenCalledTimes(1);
  }));

  it('stopTimer() should stop the interval (no more updates)', fakeAsync(() => {
    component.timer(5);

    nowMs = 1000; tick(1000);
    expect(component.elapsedTime).toBe(1);
    expect(component.timeLeft).toBe(4);

    component.stopTimer();

    // Si hubiera interval activo, estos cambios alterarían los valores
    nowMs = 2000; tick(1000);
    expect(component.elapsedTime).toBe(1);
    expect(component.timeLeft).toBe(4);
  }));

  it('resetTimer() should stop, restore timeLeft to initialTime and zero elapsedTime', fakeAsync(() => {
    component.initialTime = 10;

    component.timer(5);
    nowMs = 2000; tick(2000);
    expect(component.elapsedTime).toBe(2);
    expect(component.timeLeft).toBe(3);

    component.resetTimer();

    expect(component.elapsedTime).toBe(0);
    expect(component.timeLeft).toBe(10); // igual a initialTime

    // No debe cambiar tras más tiempo porque el interval se detuvo
    nowMs = 4000; tick(2000);
    expect(component.elapsedTime).toBe(0);
    expect(component.timeLeft).toBe(10);
  }));

  it('calling timer() again should restart counting from new value', fakeAsync(() => {
    // Primer timer
    component.timer(4);
    nowMs = 1000; tick(1000);
    expect(component.elapsedTime).toBe(1);
    expect(component.timeLeft).toBe(3);

    // 🔑 Sin tocar el componente: detenemos y descartamos timers previos
    component.stopTimer();
    discardPeriodicTasks();

    // Segundo timer
    component.timer(2);
    expect(component.elapsedTime).toBe(0);
    expect(component.timeLeft).toBe(2);

    nowMs = 2000; tick(1000);
    expect(component.elapsedTime).toBe(1);
    expect(component.timeLeft).toBe(1);

    // Limpieza extra por si acaso
    component.stopTimer();
    discardPeriodicTasks();
  }));
});
