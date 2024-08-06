import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { IGame, IGameResults, IUser } from "../../interfaces";
import { TimerComponent } from "../timer/timer.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TryAgainModalComponent } from "../try-again-modal/try-again-modal.component";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { SimonSaysService } from "../../services/simon-says.service";
import { SweetAlertService } from "../../services/sweet-alert-service.service";

@Component({
  selector: "app-sequence-game",
  standalone: true,
  imports: [TimerComponent, CommonModule, FormsModule],
  templateUrl: "./sequence-game.component.html",
  styleUrl: "./sequence-game.component.scss",
})
export class SequenceGameComponent implements OnInit {
  title = "Simon Dice";
  public alertService = inject(SweetAlertService);

  //private gameDificulty: string = "Facil";

  @Input() difficulty: string = "";

  //Decorador usado para acceder a un componente hijo
  //Nos permite acceder a propiedades y metodos del componente hijo
  @ViewChild(TimerComponent)
  timerComponent!: TimerComponent;

  // Colores de los botones utilizados en el juego
  buttonColours: string[] = ["purple", "blue", "green", "orange"];
  // Patrón de colores generado por el juego
  gamePattern: string[] = [];

  // Patrón de colores ingresado por el usuario
  userClickPattern: string[] = [];
  // Indicador de si el juego ha comenzado
  isStarted: boolean = false;

  // Nivel actual del jugador
  level: number = 0;

  // Contador de puntos del jugador
  points: number = 0;
  finalResult: number = 0;
  gameId: number | undefined = 0;

  public modalService: NgbModal = inject(NgbModal);
  private simonSaysService = inject(SimonSaysService);

  public router: Router = inject(Router);
  public route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const gameId = paramMap.get("gameId");
      this.gameId = gameId ? +gameId : undefined;
      console.log("Game ID:", this.gameId);
    });
  }

  // Método manejador de eventos de clic en el botón de inicio del juego
  onButtonPlayClick(): void {
    if (!this.isStarted) {
      this.startGame();
      console.log(this.difficulty);
    }
  }

  // Método manejador de eventos de clic en los botones de colores
  onButtonClick(colour: string): void {
    this.userClickPattern.push(colour);
    console.log("color: ", colour);

    //Play sound
    this.playSound(colour);

    this.animatePress(colour);
    this.checkAnswer(this.userClickPattern.length - 1);
  }

  // Verifica si la respuesta del usuario es correcta
  checkAnswer(currentLevel: number): void {
    if (this.isStarted === false) {
      return;
    }
    if (
      this.gamePattern[currentLevel] === this.userClickPattern[currentLevel]
    ) {
      if (this.userClickPattern.length === this.gamePattern.length) {
        this.points = this.points + 10;
        this.finalResult = this.points;

        document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
        document.getElementById("title")!.innerHTML = "Nivel: " + this.level;
        setTimeout(() => {
          this.nextSequence();
        }, 1000);
      }
    } else {
      //play sound
      this.playSound("Wrong2");
      this.endGame();
    }
  }

  // Genera la siguiente secuencia de colores del juego
  nextSequence(): void {
    this.userClickPattern = [];
    this.level++;
    console.log("Level: ", this.level);
    console.log("Dificultad: ", this.difficulty);

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = this.buttonColours[randomNumber];
    this.gamePattern.push(randomChosenColour);

    if (this.difficulty === "easy") {
      document.getElementById(randomChosenColour)!.classList.add("flash-facil");
      setTimeout(() => {
        document
          .getElementById(randomChosenColour)!
          .classList.remove("flash-facil");
      }, 800);
    } else if (this.difficulty === "medium") {
      document.getElementById(randomChosenColour)!.classList.add("flash-medio");
      setTimeout(() => {
        document
          .getElementById(randomChosenColour)!
          .classList.remove("flash-medio");
      }, 600);
    } else if (this.difficulty === "hard") {
      document
        .getElementById(randomChosenColour)!
        .classList.add("flash-dificil");
      setTimeout(() => {
        document
          .getElementById(randomChosenColour)!
          .classList.remove("flash-dificil");
      }, 200);
    }

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
    const audio = new Audio("../../../assets/sounds/" + name + ".mp3");
    audio.load();
    audio.play();
  }

  // Reinicia el juego al estado inicial
  startOver(): void {
    this.level = 1;
    this.gamePattern = [];
    this.isStarted = false;
    this.points = 0;

    document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
    document.getElementById("title")!.innerHTML = "Nivel: " + this.level;
  }

  // Finaliza el juego y muestra un mensaje
  endGame(): void {
    document.body.classList.add("game-over");

    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);

    this.timerComponent.stopTimer();
    const modalRef = this.modalService.open(TryAgainModalComponent);
    this.gatherResults();

    modalRef.componentInstance.message =
      "Fin del juego! Presione el boton de jugar para iniciar de nuevo.";

    modalRef.result.then(
      (result) => {
        if (result === "tryAgain") {
          if (this.finalResult <= 30) {
            this.difficulty = "easy";

            this.startOver();
            this.startGame();
          } else if (this.finalResult > 30 && this.finalResult < 60) {
            this.difficulty = "medium";

            this.startOver();
            this.startGame();
          } else if (this.finalResult >= 60) {
            this.difficulty = "hard";

            this.startOver();
            this.startGame();
          }
        } else if (result === "goToAnotherView") {
          this.router.navigate(["app/reminders"]);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  exitGames(){
    this.router.navigate(['/app/games'])
  }
  // Inicia el juego y la secuencia del temporizador
  startGame(): void {
    if (this.difficulty == "") {
      this.alertService.showdifficultyWarning('Ooops...','Seleccione una dificultad antes de comenzar el juego.');
    } else {
      this.isStarted = true;
      this.points = 0;
      this.level = 0;
      this.nextSequence();
      document.getElementById("title")!.innerHTML = "Nivel: " + this.level;

      this.timerComponent.timer(30);
    }
  }

  gatherResults(): void {
    const user_id: number | undefined = this.getUserIdFromLocalStorage();

    let stringDifficutly: string = "";
    if (this.difficulty === "easy") {
      stringDifficutly = "Facil";
    } else if (this.difficulty === "medium") {
      stringDifficutly = "Medio";
    } else if (this.difficulty === "hard") {
      stringDifficutly = "Dificil";
    }

    const gameResults: IGameResults = {
      gameDate: new Date().toISOString(),
      levelDifficulty: stringDifficutly,
      score: this.finalResult,
      gameId: { gameId: this.gameId } as IGame,
      userId: { id: user_id } as IUser,
    };
    console.log("Game Results: ", gameResults);
    this.simonSaysService.save(gameResults);
  }

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    console.log("AuthUser: ", authUser);
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }
}
