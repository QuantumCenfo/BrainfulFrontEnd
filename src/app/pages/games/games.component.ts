import { Component } from "@angular/core";
import { SequenceGameComponent } from "../../components/sequence-game/sequence-game.component";
import { IGame } from "../../interfaces";
import { TimerComponent } from "../../components/timer/timer.component";

@Component({
  selector: "app-games",
  standalone: true,
  imports: [SequenceGameComponent, TimerComponent],
  templateUrl: "./games.component.html",
  styleUrl: "./games.component.scss",
})
export class GamesComponent {
  selectedDifficulty: string = "";
  onButtonDificultyClick(dificulty: string): void {
    this.selectedDifficulty = dificulty;
    console.log("Selected: ", this.selectedDifficulty);
  }
}
