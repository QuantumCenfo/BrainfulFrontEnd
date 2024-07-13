import { Component, effect, inject, Input, ViewChild } from "@angular/core";
import { SequenceGameComponent } from "../../components/sequence-game/sequence-game.component";
import { IGame } from "../../interfaces";
import { TimerComponent } from "../../components/timer/timer.component";
import { MemoryBoardComponent } from "../../components/memory-board/memory-board.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MemoryCardComponent } from "../../components/memory-card/memory-card.component";
import { GameService } from "../../services/game.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-games",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.scss"],
})
export class GamesComponent {
  @ViewChild(MemoryBoardComponent) memoryBoard!: MemoryBoardComponent;
  difficulty: number = 0;
  public gameList: IGame[] = [];
  private service = inject(GameService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.gameList = this.service.games$();
    });
  }

  navigateToGame(game: IGame) {
    const gameId = game.gameId;
    if (gameId !== undefined) {
      const gameRoute = this.getGameRoute(gameId);
      if (gameRoute) {
        this.router.navigate([gameRoute, { gameId: gameId }]);
      }
    } else {
      console.error('Game ID is undefined');
    }
  }
  //Rutas de juegos Aqui pongan las que falten

  getGameRoute(gameId: number): string | null {
    switch (gameId) {
      case 1:
        return 'app/sequence-game';
      case 2:
        return 'app/memory-game';
      case 3:
        return 'app/reaction-game';
      default:
        return null;
    }
  }
//Trackea el id de todos los juegos
  trackById(index: number, item: IGame): number {
    return item.gameId!;
  }
  
  public gamesList: IGame[] = [
    {
      gameId: 1,
      name: "Simon Dice Dificultad Facil",
      description:
        "Juego de Simon dice. Seguir la secuencia de colores que se presenta.",
      typeExercise: "Ejercicio Cognitivo",
    },
    {
      gameId: 2,
      name: "Simon Dice Dificultad Media",
      description:
        "Juego de Simon dice. Preisone el boton verde lo mas rapido posible..",
      typeExercise: "Ejercicio Cognitivo",
    },
  ];
}
