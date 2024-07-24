import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IChallengeGame, IChallengeOutdoor } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ChallengeOutdoorService extends BaseService<IChallengeOutdoor> {
  protected override source: string = "challengeOutdoor";
  private snackBar = inject(MatSnackBar);
  private challengeOutdoorSignal = signal<IChallengeOutdoor[]>([]);

  constructor(protected override http: HttpClient) {
    super();
  }

  get challengeOutdoors$() {
    return this.challengeOutdoorSignal;
  }

  getAllActiveChallenges() {
    this.http.get<IChallengeOutdoor[]>(`${this.source}`).subscribe({
      next: (res: IChallengeOutdoor[]) => {
        res.reverse();
        this.challengeOutdoorSignal.set(res);
        console.log("Active challenges fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching active challenges", err);
      },
    });
  }
}
