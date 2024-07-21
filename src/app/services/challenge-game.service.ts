import { HttpClient } from '@angular/common/http';
import { IChallengeGame } from './../interfaces/index';
import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: "root",
})
export class ChallengeGameService extends BaseService<IChallengeGame> {
  protected override source: string = "challengeGames";
  private snackBar = inject(MatSnackBar);
  private challengeGameSignal = signal<IChallengeGame[]>([]);
  constructor(protected override http: HttpClient) {
    super();  
  }

  get challengeGame$() {
    return this.challengeGameSignal;
  }

  getAllActiveChallenges() {
    this.findAll().subscribe({
      next: (res: any) => {
        res.reverse();
        this.challengeGameSignal.set(res);
        console.log("Active challenges fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching active challenges", err);
      },
    });
  }

  getAllInactiveChallenges() {
    this.findAll().subscribe({
      next: (res: any) => {
        res.reverse();
        this.challengeGameSignal.set(res);
        console.log("Inactive challenges successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching inactive challenges", err);
      },
    });
  }


  public save(item: IChallengeGame) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.challengeGameSignal.update((results: IChallengeGame[]) => [response, ...results]);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
        console.error('error', error);
      }
    })
  }

  updateDateChallengeGame(challengeGame: IChallengeGame) {
    this.edit(challengeGame.challengeId, challengeGame).subscribe({
      next: (res: any) => {
        const updatedChallengeGames = this.challengeGameSignal().map((cg) =>
          cg.challengeId === challengeGame.challengeId ? res : cg
        );
        this.challengeGameSignal.set(updatedChallengeGames);
        console.log("Response: ", res);
        console.log("Challenge game updated successfully");
      },
      error: (err: any) => {
        console.error("Error updating challenge game", err);
      },
    });
  }

}