import { Component, inject, Input, ViewChild } from "@angular/core";
import { IGameResults } from "../../interfaces";
import { GameResultsService } from "../../services/game-results.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: "app-leaderboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./leaderboard.component.html",
  styleUrl: "./leaderboard.component.scss",
})
export class LeaderboardComponent {
  @Input() gameResults: IGameResults[] = [];

  gameId: number | undefined = 0;

  private gameResultsService = inject(GameResultsService);

  userId: number = this.getUserIdFromLocalStorage() || 0;
  public route: ActivatedRoute = inject(ActivatedRoute);

  rank: number = 0;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.gameResultsService.getGameResultsByUserId(this.userId);
    this.route.paramMap.subscribe((paramMap) => {
      const gameId = paramMap.get("gameId");
      this.gameId = gameId ? +gameId : undefined;
      console.log("Game ID from leaderboard:", this.gameId);
    });
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
