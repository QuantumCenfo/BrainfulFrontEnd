import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IGameResults } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SimonSaysService extends BaseService<IGameResults> {
  protected override source: string = "gameResults";

  private resultsListSignal = signal<IGameResults[]>([]);

  //Salva los resultados del juego
  public save(item: IGameResults) {
    this.add(item).subscribe({
      next: (res: any) => {
        this.resultsListSignal.update((results: IGameResults[]) => [
          res,
          ...results,
        ]);
      },
      error: (error: any) => {
       
        console.error("error", error);
      },
    });
  }
}
