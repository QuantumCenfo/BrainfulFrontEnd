import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-timer",
  standalone: true,
  imports: [],
  templateUrl: "./timer.component.html",
  styleUrl: "./timer.component.scss",
})
export class TimerComponent {
  @Input() initialTime: number = 0;
  @Output() timerEnded = new EventEmitter<void>();
  public timeLeft: number = 0;
  public elapsedTime: number = 0;
  private intervalId: any;
  private initialTimeMillis: number = 0;

  timer(timeLeft: number): void {
    this.timeLeft = timeLeft;
    this.elapsedTime = 0;
    this.initialTimeMillis = Date.now();

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const elapsedMillis = now - this.initialTimeMillis;
      this.elapsedTime = Math.floor(elapsedMillis / 1000);
      this.timeLeft = timeLeft - this.elapsedTime;

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.timerEnded.emit();
      }
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.intervalId);
  }

  resetTimer(): void {
    this.stopTimer();
    this.timeLeft = this.initialTime;
    this.elapsedTime = 0;
    this.initialTimeMillis = 0;
  }
}