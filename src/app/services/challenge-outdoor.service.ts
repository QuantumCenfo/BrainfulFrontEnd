import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IChallengeGame, IChallengeOutdoor } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { SweetAlertService } from './sweet-alert-service.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengeOutdoorService extends BaseService<IChallengeOutdoor> {
  protected override source: string = "challengeOutdoor";

  private challengeOutdoorSignal = signal<IChallengeOutdoor[]>([]);
  private activeChallengeOutdoorSignal = signal<IChallengeOutdoor[]>([]);
  private inactiveChallengeOutdoorSignal = signal<IChallengeOutdoor[]>([]);

  constructor(protected override http: HttpClient,  private sweetAlertService: SweetAlertService ) {
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
  getAllChallengesByStatus(status: string) {
    this.http.get<IChallengeOutdoor[]>(`${this.source}/challenges?status=${status}`).subscribe({
      next: (res: IChallengeOutdoor[]) => {
        res.reverse();
        if (status === 'active') {
          this.activeChallengeOutdoorSignal.set(res);
        } else if (status === 'inactive') {
          this.inactiveChallengeOutdoorSignal.set(res);
        }
        console.log(`${status.charAt(0).toUpperCase() + status.slice(1)} challenges fetched successfully`);
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error(`Error fetching ${status} challenges`, err);
      },
    });
  }

  public save(item: IChallengeOutdoor) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.challengeOutdoorSignal.update((results: IChallengeOutdoor[]) => [response, ...results]);
        this.sweetAlertService.showSuccess(
          "Desafío externo guardado",
        ).then(() => {
          window.location.reload();
        });
      },
      error: (error : any) => {
        this.sweetAlertService.showError(
          "Hubo un error guardando el desafío externo",
        ).then(() => {
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
        this.sweetAlertService.showSuccess(
          "Desafío externo actualizado"
        ).then(() => {
          window.location.reload();
        });
      },
      error: (err: any) => {
        this.sweetAlertService.showError(
          "Hubo un error actualizando el desafío externo"
        ).then(() => {
          window.location.reload();
        });
      },
    });
  }
}
