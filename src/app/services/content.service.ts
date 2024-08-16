import { HttpClient } from '@angular/common/http';
import { IContent } from './../interfaces/index';
import { inject, Injectable, signal } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BaseService } from "./base-service";
import { SweetAlertService } from './sweet-alert-service.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService extends BaseService<IContent>{

  public override source: string = "media";
  private snackBar = inject(MatSnackBar);
  public contentSignal = signal<IContent[]>([]);
  public router = inject(Router);
  constructor(protected override http: HttpClient ,private sweetAlertService: SweetAlertService) {
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
        this.sweetAlertService.showSuccess("Contenido creado").then(() => {
          window.location.reload();
        });
      },
      error: (error : any) => {
        this.sweetAlertService.showError(
          "Hubo un error guardando el contenido"
        ).then(() => {
          window.location.reload();
        });
      }
    })
  }

  updateDateChallengeGame(challengeGame: IContent) {
    this.edit(challengeGame.mediaId, challengeGame).subscribe({
      next: (res: any) => {
        const updatedContents = this.contentSignal().map((c) =>
          c.mediaId === challengeGame.mediaId ? res : c
        );
        this.contentSignal.set(updatedContents);
        this.sweetAlertService.showSuccess("Contenido actualizado").then(() => {
          window.location.reload();
        });
      },
      error: (err: any) => {
        this.sweetAlertService.showError(
          "Hubo un error actualizando el contenido"
        ).then(() => {
          window.location.reload();
        });
      },
    });
  }

  deleteContent(contentId: number) {
    this.sweetAlertService
      .showQuestion(
        "¿Está seguro que desea eliminar el contenido?",
        "No podrá recuperar la información"
      ).then((res) => {
        if (res.isConfirmed) {
          this.del(contentId).subscribe({
            next: () => {
              const deletedContent = this.contentSignal().filter(
                (content: IContent) => content.mediaId !== contentId
              );
              this.contentSignal.set(deletedContent);
              this.sweetAlertService.showSuccess(
                "Contenido borrado exitosamente"
              );
            },
            error: (err: any) => {
              console.log("error");
              this.sweetAlertService.showError(
                "No puedes borrar una insignia que tenga un desafío asociado"
              );
              return throwError(
                () => new Error("Error al agregar la participación")
              );
            },
          });
        }
    }).then(() => {
      window.location.reload();
    });
  }
}
