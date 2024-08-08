import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IGameResults } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class GameResultsService extends BaseService<IGameResults> {
  protected override source: string = "gameResults";

  private gameResultSignal = signal<IGameResults[]>([]);

  get gameResults$() {
    return this.gameResultSignal;
  }

  getGameResultsByUserId(userID: number) {
    this.findAll().subscribe({
      next: (res: any) => {
        res.sort((a: any, b: any) => b.score - a.score);
        console.log("Results:", res);
        this.gameResultSignal.set(res);
      },
    });
  }
}
