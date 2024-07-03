import { Component } from "@angular/core";
import { SequenceGameComponent } from "../../components/sequence-game/sequence-game.component";
import { IGame } from "../../interfaces";

@Component({
  selector: "app-games",
  standalone: true,
  imports: [SequenceGameComponent],
  templateUrl: "./games.component.html",
  styleUrl: "./games.component.scss",
})
export class GamesComponent {
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
