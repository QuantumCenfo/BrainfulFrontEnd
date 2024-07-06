import { Component, Input, ViewChild } from "@angular/core";
import { SequenceGameComponent } from "../../components/sequence-game/sequence-game.component";
import { IGame } from "../../interfaces";
import { TimerComponent } from "../../components/timer/timer.component";
import { MemoryBoardComponent } from "../../components/memory-board/memory-board.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MemoryCardComponent } from "../../components/memory-card/memory-card.component";

@Component({
  selector: "app-games",
  standalone: true,
  imports: [SequenceGameComponent, TimerComponent,MemoryBoardComponent,FormsModule,CommonModule,MemoryCardComponent],
  templateUrl: "./games.component.html",
  styleUrl: "./games.component.scss",
})
export class GamesComponent {

  @ViewChild(MemoryBoardComponent) memoryBoard!: MemoryBoardComponent;
  difficulty: number = 0; // Initialize difficulty property here

  constructor() { }
 
  public gamesList: IGame[] = [
    {
      gameId: 1,
      name: "Simon Dice Dificultad Facil",
      description:
        "Juego de Simon dice. Seguir la secuencia de colores que se presenta.",
      levelDifficult: "Facil",
      typeExercise: "Ejercicio Cognitivo",
    },
    {
      gameId: 2,
      name: "Simon Dice Dificultad Media",
      description:
        "Juego de Simon dice. Preisone el boton verde lo mas rapido posible..",
      levelDifficult: "Medio",
      typeExercise: "Ejercicio Cognitivo",
    },
  ];
}
