import { HttpClient } from '@angular/common/http';
import { IContent } from './../interfaces/index';
import { inject, Injectable, signal } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BaseService } from "./base-service";

@Injectable({
  providedIn: 'root'
})
export class ContentService extends BaseService<IContent>{

  public override source: string = "media";
  private snackBar = inject(MatSnackBar);
  public contentSignal = signal<IContent[]>([]);
  public router = inject(Router);
  constructor(protected override http: HttpClient) {
    super();  
  }

  get content$() {
    return this.contentSignal;
  }

  getAllContents() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        console.log(response);
        this.contentSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      }
    });
  }

  public save(item: IContent) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.contentSignal.update((results: IContent[]) => [response, ...results]);
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

  updateDateChallengeGame(challengeGame: IContent) {
    this.edit(challengeGame.contentId, challengeGame).subscribe({
      next: (res: any) => {
        const updatedContents = this.contentSignal().map((c) =>
          c.contentId === challengeGame.contentId ? res : c
        );
        this.contentSignal.set(updatedContents);
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

  deleteChallengeGame(contentId: number) {
    Swal.fire({
      title: "Seguro que desea eliminar el desafio?",
      text: "No podrá recuperar la información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then((res) => {
      this.del(contentId).subscribe({
        next: () => {
          const deletedContent = this.contentSignal().filter(
            (content: IContent) => content.contentId !== contentId
          );
          this.contentSignal.set(deletedContent);

          console.log("Desafio borrado successfully");
        }
      });
    }).then(() => {
      window.location.reload();
    });
  }
}
