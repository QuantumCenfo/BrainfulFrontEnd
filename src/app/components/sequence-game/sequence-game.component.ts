import { Component, HostListener, OnInit } from "@angular/core";
import { IGameResults } from "../../interfaces";

@Component({
  selector: "app-sequence-game",
  standalone: true,
  imports: [],
  templateUrl: "./sequence-game.component.html",
  styleUrl: "./sequence-game.component.scss",
})
export class SequenceGameComponent implements OnInit {
  title = "Simon Dice";
  buttonColours: string[] = ["purple", "blue", "green", "orange"];
  gamePattern: string[] = [];

  userClickPattern: string[] = [];
  started = false;
  level = 0;

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  //Host listener decorator replaces jquery $(document).keypress
  @HostListener("window:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.started) {
      this.nextSequence();
      this.started = true;
    }
  }

  onButtonClick(colour: string): void {
    this.userClickPattern.push(colour);
    //Play sound
    this.animatePress(colour);
    this.checkAnswer(this.userClickPattern.length - 1);
  }

  checkAnswer(currentLevel: number): void {
    if (
      this.gamePattern[currentLevel] === this.userClickPattern[currentLevel]
    ) {
      if (this.userClickPattern.length === this.gamePattern.length) {
        setTimeout(() => {
          this.nextSequence();
        }, 1000);
      }
    } else {
      //play sound
      document.body.classList.add("game-over");
      document.getElementById("level-title")!.innerText =
        "Game Over, Press Any Key to Restart";
      setTimeout(() => {
        document.body.classList.remove("gmae-over");
      }, 200);
      this.startOver();
    }
  }

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

  animatePress(currentColour: string): void {
    document.getElementById(currentColour)!.classList.add("pressed");
    setTimeout(() => {
      document.getElementById(currentColour)!.classList.remove("pressed");
    }, 100);
  }

  playSound(name: string): void {
    const audio = new Audio(`assets/sounds/${name}.mp3`);
    audio.play;
  }

  startOver(): void {
    this.level = 0;
    this.gamePattern = [];
    this.started = false;
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
