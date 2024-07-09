import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IGame, IGameResults } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class GameService extends BaseService<IGame> {
  protected override source: string = "games";
  private gamesListSignal = signal<IGame[]>([]);

  get games$() {
    return this.gamesListSignal;
  }
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.gamesListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching games', error);
      }
    });
  }
  
}
