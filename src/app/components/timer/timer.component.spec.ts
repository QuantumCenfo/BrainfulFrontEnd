import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerComponent } from './timer.component';
import { By } from '@angular/platform-browser';
import { tick, fakeAsync } from '@angular/core/testing';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerComponent] // Import the standalone component
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start the timer and emit timerEnded when time is up', fakeAsync(() => {
    spyOn(component.timerEnded, 'emit'); // Spy on the timerEnded event
    component.initialTime = 3; // Set an initial time of 3 seconds
    component.timer(component.initialTime);
    
    tick(3000); // Simulate 3 seconds passing
    
    expect(component.timeLeft).toBe(0); // Time left should be 0
    expect(component.elapsedTime).toBe(3); // Elapsed time should be 3 seconds
    expect(component.timerEnded.emit).toHaveBeenCalled(); // timerEnded should be emitted
  }));

  it('should stop the timer', fakeAsync(() => {
    component.initialTime = 5;
    component.timer(component.initialTime);
    
    component.stopTimer(); // Stop the timer immediately
    tick(3000); // Simulate 3 seconds passing
    
    expect(component.timeLeft).toBe(component.initialTime); // Time left should be unchanged
  }));

  it('should reset the timer', fakeAsync(() => {
    component.initialTime = 5;
    component.timer(component.initialTime);
    
    tick(2000); // Simulate 2 seconds passing
    component.resetTimer(); // Reset the timer
    
    expect(component.timeLeft).toBe(component.initialTime); // Time left should be reset to initial time
    expect(component.elapsedTime).toBe(0); // Elapsed time should be reset
  }));
});
