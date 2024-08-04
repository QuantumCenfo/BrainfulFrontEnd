import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerComponent } from './timer.component';
import { By } from '@angular/platform-browser';
import { tick, fakeAsync } from '@angular/core/testing';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerComponent] 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start the timer and emit timerEnded when time is up', fakeAsync(() => {
    spyOn(component.timerEnded, 'emit');
    component.initialTime = 3; 
    component.timer(component.initialTime);
    
    tick(3000); 
    
    expect(component.timeLeft).toBe(0); 
    expect(component.elapsedTime).toBe(3); 
    expect(component.timerEnded.emit).toHaveBeenCalled(); 
  }));

  it('should stop the timer', fakeAsync(() => {
    component.initialTime = 5;
    component.timer(component.initialTime);
    
    component.stopTimer(); 
    tick(3000); 
    
    expect(component.timeLeft).toBe(component.initialTime); 
  }));

  it('should reset the timer', fakeAsync(() => {
    component.initialTime = 5;
    component.timer(component.initialTime);
    
    tick(2000); 
    component.resetTimer(); 
    
    expect(component.timeLeft).toBe(component.initialTime);
    expect(component.elapsedTime).toBe(0); 
  }));
});
