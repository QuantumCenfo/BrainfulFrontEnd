import { HttpClient } from '@angular/common/http';
import { IChallengeGame } from './../interfaces/index';
import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SweetAlertService } from './sweet-alert-service.service';

@Injectable({
  providedIn: "root",
})
export class ChallengeGameService extends BaseService<IChallengeGame> {
  public override source: string = "challengeGame";

  private activeChallengeGameSignal = signal<IChallengeGame[]>([]);
  private inactiveChallengeGameSignal = signal<IChallengeGame[]>([]);
  public challengeGameSignal = signal<IChallengeGame[]>([]);
  public router = inject(Router);
  constructor(protected override http: HttpClient,  private sweetAlertService: SweetAlertService ) {
    super();
  }

  get activeChallengeGame$() {
    return this.activeChallengeGameSignal;
  }

  get inactiveChallengeGame$() {
    return this.inactiveChallengeGameSignal;
  }

  get challengeGame$() {
    return this.challengeGameSignal;
  }

  getAllChallengesByStatus(status: string) {
    this.http.get<IChallengeGame[]>(`${this.source}/challenges?status=${status}`).subscribe({
      next: (res: IChallengeGame[]) => {
        res.reverse();
        if (status === 'active') {
          this.activeChallengeGameSignal.set(res);
        } else if (status === 'inactive') {
          this.inactiveChallengeGameSignal.set(res);
        }
        console.log(`${status.charAt(0).toUpperCase() + status.slice(1)} challenges fetched successfully`);
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error(`Error fetching ${status} challenges`, err);
      },
    });
  }
  


  public save(item: IChallengeGame) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.challengeGameSignal.update((results: IChallengeGame[]) => [response, ...results]);
        this.sweetAlertService.showSuccess(
          "Desafío guardado",
        ).then(() => {
          window.location.reload();
        });
      },
      error: (error : any) => {
        this.sweetAlertService.showError(
          "Hubo un error guardando el desafío",
        ).then(() => {
          window.location.reload();
        });
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
        this.sweetAlertService.showSuccess(
          "Desafío actualizado"
        ).then(() => {
          window.location.reload();
        });
      },
      error: (err: any) => {
        this.sweetAlertService.showError(
          "Hubo un error actualizando el desafío "
        ).then(() => {
          window.location.reload();
        });
      },
    });
  }

  deleteChallengeGame(badgeId: number) {
    this.sweetAlertService.showQuestion(
      "¿Estás seguro que deseas eliminar el comentario?",
      "No podrás revertir esto",
    ).then((res) => {
      this.del(badgeId).subscribe({
        next: () => {
          const deletedChallengeGame = this.challengeGameSignal().filter(
            (badge: IChallengeGame) => badge.badgeId !== badgeId
          );
          this.challengeGameSignal.set(deletedChallengeGame);
          this.sweetAlertService.showSuccess(
            "El desafío ha sido eliminado",
          );
        },
        error: (err: any) => {
 
          this.sweetAlertService.showError(
            "Ha ocurrido un error eliminando el desafío",
      
          );
        },
      });
    }).then(() => {
      window.location.reload();
    });
  }

}