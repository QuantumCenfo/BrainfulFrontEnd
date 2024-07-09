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
  private intervalId: any;

  timer(timeLeft: number): void {
    this.timeLeft = timeLeft;
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      console.log(this.timeLeft);
      if (this.timeLeft === 0) {
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
  }
}
