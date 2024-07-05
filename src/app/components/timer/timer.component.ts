import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-timer",
  standalone: true,
  imports: [],
  templateUrl: "./timer.component.html",
  styleUrl: "./timer.component.scss",
})
export class TimerComponent {
  //Decorador usado para enviar eventos de un component hijo a un compoennte padre

  public intervalId: any;
  public timeLeft: number = 0;

  @Output() timerEnded = new EventEmitter<void>();
  // Inicia el temporizador del juego
  timer(timeLeft: number): void {
    this.intervalId = setInterval(() => {
      timeLeft--;
      document.getElementById("time")!.innerHTML = "" + timeLeft;
      console.log(timeLeft);
      if (timeLeft === 0) {
        this.stopTimer();

        this.timerEnded.emit();
      }
    }, 1000);
  }

  // Detiene el temporizador del juego
  stopTimer(): void {
    clearInterval(this.intervalId);
  }
}
