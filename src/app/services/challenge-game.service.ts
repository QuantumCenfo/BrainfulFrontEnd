import { HttpClient } from '@angular/common/http';
import { IChallengeGame } from './../interfaces/index';
import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root",
})
export class ChallengeGameService extends BaseService<IChallengeGame> {
  public override source: string = "challengeGame";
  private snackBar = inject(MatSnackBar);
  private activeChallengeGameSignal = signal<IChallengeGame[]>([]);
  private inactiveChallengeGameSignal = signal<IChallengeGame[]>([]);
  public challengeGameSignal = signal<IChallengeGame[]>([]);
  public router = inject(Router);
  constructor(protected override http: HttpClient) {
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

  getAllActiveChallenges() {
    this.http.get<IChallengeGame[]>(`${this.source}/active-challenges`).subscribe({
      next: (res: IChallengeGame[]) => {
        res.reverse();
        this.activeChallengeGameSignal.set(res);
        console.log("Active challenges fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching active challenges", err);
      },
    });
  }

  getAllInactiveChallenges() {
    this.http.get<IChallengeGame[]>(`${this.source}/inactive-challenges`).subscribe({
      next: (res: IChallengeGame[]) => {
        res.reverse();
        this.inactiveChallengeGameSignal.set(res);
        console.log("Inactive challenges fetched successfully");
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
        Swal.fire({
          iconColor: "white",
          color: "white",
          background: "#36cf4f",
          confirmButtonColor: "#ff9f1c",
          cancelButtonColor: "#16c2d5",
          title: "Desafío guardado",
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
          text: 'Hubo un error guardando el desafío',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
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
        Swal.fire({
          iconColor: "white",
          color: "white",
          background: "#36cf4f",
          confirmButtonColor: "#ff9f1c",
          cancelButtonColor: "#16c2d5",
          title: "Desafío actualizado",
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
          text: 'Hubo un error actualizando el desafío',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      },
    });
  }

  deleteChallengeGame(badgeId: number) {
    Swal.fire({
      title: "Seguro que desea eliminar el desafio?",
      text: "No podrá recuperar la información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then((res) => {
      this.del(badgeId).subscribe({
        next: () => {
          const deletedChallengeGame = this.challengeGameSignal().filter(
            (badge: IChallengeGame) => badge.badgeId !== badgeId
          );
          this.challengeGameSignal.set(deletedChallengeGame);

          console.log("Desafio borrado successfully");
        }
      });
    }).then(() => {
      window.location.reload();
    });
  }

}