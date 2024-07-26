import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IChallengeGame, IChallengeOutdoor } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ChallengeOutdoorService extends BaseService<IChallengeOutdoor> {
  protected override source: string = "challengeOutdoor";
  private snackBar = inject(MatSnackBar);
  private challengeOutdoorSignal = signal<IChallengeOutdoor[]>([]);
  private activeChallengeOutdoorSignal = signal<IChallengeOutdoor[]>([]);
  private inactiveChallengeOutdoorSignal = signal<IChallengeOutdoor[]>([]);

  constructor(protected override http: HttpClient) {
    super();
  }

  get activeChallengeOutdoor$() {
    return this.activeChallengeOutdoorSignal;
  }

  get inactiveChallengeOutdoor$() {
    return this.inactiveChallengeOutdoorSignal;
  }

  get challengeOutdoors$() {
    return this.challengeOutdoorSignal;
  }

  getAllActiveChallenges() {
    this.http.get<IChallengeOutdoor[]>(`${this.source}/active-challenges`).subscribe({
      next: (res: IChallengeOutdoor[]) => {
        res.reverse();
        this.activeChallengeOutdoorSignal.set(res);
        console.log("Active challenges fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching active challenges", err);
      },
    });
  }

  getAllInactiveChallenges() {
    this.http.get<IChallengeOutdoor[]>(`${this.source}/inactive-challenges`).subscribe({
      next: (res: IChallengeOutdoor[]) => {
        res.reverse();
        this.inactiveChallengeOutdoorSignal.set(res);
        console.log("Inactive challenges fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching inactive challenges", err);
      },
    });
  }

  public save(item: IChallengeOutdoor) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.challengeOutdoorSignal.update((results: IChallengeOutdoor[]) => [response, ...results]);
        Swal.fire({
          iconColor: "white",
          color: "white",
          background: "#36cf4f",
          confirmButtonColor: "#ff9f1c",
          cancelButtonColor: "#16c2d5",
          title: "Desafío externo guardado",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          showCancelButton: false,
        }).then(() => {
          window.location.reload();
        });
      },
      error: (error : any) => {
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          iconColor: 'white',
          color: 'white',
          background:'#d54f16',
          position: 'center',
          text: 'Hubo un error guardando el desafío externo',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      }
    })
  }

  updateDateChallengeOutdoor(challengeOutdoor: IChallengeOutdoor) {
    this.edit(challengeOutdoor.outdoorChallengeId, challengeOutdoor).subscribe({
      next: (res: any) => {
        const updatedChallengeOutdoors = this.challengeOutdoorSignal().map((co) =>
          co.outdoorChallengeId === challengeOutdoor.outdoorChallengeId ? res : co
        );
        this.challengeOutdoorSignal.set(updatedChallengeOutdoors);
        Swal.fire({
          iconColor: "white",
          color: "white",
          background: "#36cf4f",
          confirmButtonColor: "#ff9f1c",
          cancelButtonColor: "#16c2d5",
          title: "Desafío externo actualizado",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          showCancelButton: false,
        }).then(() => {
          window.location.reload();
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          iconColor: 'white',
          color: 'white',
          background:'#d54f16',
          position: 'center',
          text: 'Hubo un error actualizando el desafío externo',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      },
    });
  }
}
