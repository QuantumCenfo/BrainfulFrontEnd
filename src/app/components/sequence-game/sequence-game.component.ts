import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { IGameResults } from "../../interfaces";
import { TimerComponent } from "../timer/timer.component";

@Component({
  selector: "app-sequence-game",
  standalone: true,
  imports: [TimerComponent],
  templateUrl: "./sequence-game.component.html",
  styleUrl: "./sequence-game.component.scss",
})
export class SequenceGameComponent implements OnInit {
  title = "Simon Dice";

  //Decorador usado para acceder a un componente hijo
  //Nos permite acceder a propiedades y metodos del componente hijo
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;

  //public countdown = inject(TimerComponent);

  // Colores de los botones utilizados en el juego
  buttonColours: string[] = ["purple", "blue", "green", "orange"];
  // Patrón de colores generado por el juego
  gamePattern: string[] = [];

  // Patrón de colores ingresado por el usuario
  userClickPattern: string[] = [];
  // Indicador de si el juego ha comenzado
  started = false;

  // Nivel actual del jugador
  level: number = 0;

  // Contador de puntos del jugador
  points: number = 0;

  // Tiempo restante en segundos
  timeLeft: number = 60;

  // ID del intervalo del temporizador
  intervalId: any;

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  //Host listener decorator replaces jquery $(document).keypress
  // @HostListener("window:keydown", ["$event"])
  // handleKeyboardEvent(event: KeyboardEvent): void {
  //   if (!this.started) {
  //     this.nextSequence();
  //     this.started = true;
  //   }
  // }

  // Método manejador de eventos de clic en el botón de inicio del juego
  onButtonPlayClick(): void {
    if (!this.started) {
      this.startGame();
    }
  }

  // Método manejador de eventos de clic en los botones de colores
  onButtonClick(colour: string): void {
    this.userClickPattern.push(colour);
    console.log(colour);
    //Play sound
    this.animatePress(colour);
    this.checkAnswer(this.userClickPattern.length - 1);
  }

  // Verifica si la respuesta del usuario es correcta
  checkAnswer(currentLevel: number): void {
    if (
      this.gamePattern[currentLevel] === this.userClickPattern[currentLevel]
    ) {
      if (this.userClickPattern.length === this.gamePattern.length) {
        this.points = this.points + 10;
        document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
        setTimeout(() => {
          this.nextSequence();
        }, 1000);
      }
    } else {
      //play sound
      this.endGame(
        "Fin del juego! Presione el boton de jugar para iniciar de nuevo."
      );
    }
  }

  // Genera la siguiente secuencia de colores del juego
  nextSequence(): void {
    this.userClickPattern = [];
    this.level++;

    document.getElementById("level-title")!.innerText = "Nivel " + this.level;

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = this.buttonColours[randomNumber];
    this.gamePattern.push(randomChosenColour);

    document.getElementById(randomChosenColour)!.classList.add("flash");
    setTimeout(() => {
      document.getElementById(randomChosenColour)!.classList.remove("flash");
    }, 200);

    //PlaySound
  }

  // Anima el botón presionado por el usuario
  animatePress(currentColour: string): void {
    document.getElementById(currentColour)!.classList.add("pressed");
    setTimeout(() => {
      document.getElementById(currentColour)!.classList.remove("pressed");
    }, 100);
  }

  // Reproduce el sonido correspondiente al nombre del archivo
  playSound(name: string): void {
    const audio = new Audio(`assets/sounds/${name}.mp3`);
    audio.play;
  }

  // Reinicia el juego al estado inicial
  startOver(): void {
    this.level = 0;
    this.gamePattern = [];
    this.started = false;
    this.points = 0;
    document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
  }

  // Finaliza el juego y muestra un mensaje
  endGame(message: string): void {
    document.body.classList.add("game-over");
    document.getElementById("level-title")!.innerText = message;
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);
    this.startOver();
    this.timerComponent.stopTimer();
  }

  // Inicia el juego y la secuencia del temporizador
  startGame(): void {
    this.started = true;
    this.points = 0;
    this.level = 0;
    this.nextSequence();

    this.timerComponent.timer(30);
  }

  public gameResults: IGameResults[] = [
    {
      resultId: 1,
      gameDate: "2024-07-02 12:17:02.070000",
      levelDifficult: "Facil",
      score: 20,
      time: 5,
      gameId: 1,
      userId: 1,
    },
  ];
}
