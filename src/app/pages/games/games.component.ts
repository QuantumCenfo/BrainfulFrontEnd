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
import { ModalComponent } from "../../components/modal/modal.component";
import { InstructionsComponent } from "../../components/instructions/instructions.component";

@Component({
  selector: "app-games",
  standalone: true,

  imports: [
    SequenceGameComponent,
    TimerComponent,
    MemoryBoardComponent,
    FormsModule,
    CommonModule,
    MemoryCardComponent,
    ModalComponent,
    InstructionsComponent,
  ],

  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.scss"],
})
export class GamesComponent {
  selectedDifficulty: string = "";
  onButtonDificultyClick(dificulty: string): void {
    this.selectedDifficulty = dificulty;
    console.log("Selected: ", this.selectedDifficulty);
  }

  @ViewChild(MemoryBoardComponent) memoryBoard!: MemoryBoardComponent;
  @ViewChild("showGame") showGame!: ModalComponent;
  public gameList: IGame[] = [];
  private service = inject(GameService);
  private router = inject(Router);

  displayedGames: IGame[] = [];
  currentIndex: number = 0;

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.gameList = this.service.games$();
      this.updateDisplayedGames();
    });
  }

  updateDisplayedGames(): void {
    this.displayedGames = [this.gameList[this.currentIndex]];
  }

  nextGame(): void {
    this.currentIndex = (this.currentIndex + 1) % this.gameList.length;
    this.updateDisplayedGames();
  }

  previousGame(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.gameList.length) % this.gameList.length;
    this.updateDisplayedGames();
  }

  get previousGameIndex(): number | null {
    if (this.gameList.length > 1) {
      return (
        (this.currentIndex - 1 + this.gameList.length) % this.gameList.length
      );
    }
    return null;
  }

  get nextGameIndex(): number | null {
    if (this.gameList.length > 1) {
      return (this.currentIndex + 1) % this.gameList.length;
    }
    return null;
  }

  navigateToGame(game: IGame): void {
    const gameId = game.gameId;
    if (gameId !== undefined) {
      const gameRoute = this.getGameRoute(gameId);
      if (gameRoute) {
        this.router.navigate([gameRoute, { gameId: gameId }]);
      }
    } else {
      console.error("Game ID is undefined");
    }
  }

  getGameRoute(gameId: number): string | null {
    switch (gameId) {
      case 1:
        return "app/sequence-game";
      case 2:
        return "app/memory-game";
      case 3:
        return "app/reaction-game";
      case 4:
        return "app/puzzle-game";
      default:
        return null;
    }
  }
  trackById(index: number, item: IGame): number {
    return item.gameId!;
  }

  openInstructions() {
    this.showGame.show();
  }
}
