import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IComment, IForum, IResponse } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { SweetAlertService } from "./sweet-alert-service.service";

@Injectable({
  providedIn: "root",
})
export class CommentService extends BaseService<IComment> {
  protected override source: string = "comments";
  private commentsSignal = signal<IComment[]>([]);


  get comments$() {
    return this.commentsSignal;
  }
  constructor(
   
    private sweetAlertService: SweetAlertService
  ) {
    super();
  }

  //Get all games
  getCommentsSignal(forumId: string) {
    this.http
      .get<IResponse<IComment[]>>(`${this.source}/${forumId}`)
      .subscribe({
        next: (response: any) => {
          response.reverse();
          this.commentsSignal.set(response);
        },
        error: (error: any) => {
          console.error("Error fetching forums", error);
        },
      });
  }

  public save(item: IComment) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.commentsSignal.update((forums: IComment[]) => [
          response,
          ...forums,
        ]);
        this.sweetAlertService.showSuccess(
          "El comentario ha sido agregado"
        );
      },
      error: (error: any) => {
        console.error("error", error);
        this.sweetAlertService.showError(
          "Ha ocurrido un error agregando el comentario"
        );
      },
    });
  }

  public update(item: IComment) {
    this.edit(item.commentId, item).subscribe({
      next: () => {
        const updatedItems = this.commentsSignal().map((comment) =>
          comment.commentId === item.commentId ? item : comment
        );
        this.commentsSignal.set(updatedItems);
        this.sweetAlertService.showSuccess(
          "El comentario ha sido modificado"
        );
      },
      error: (error: any) => {
        
        console.error("error", error);
        this.sweetAlertService.showError(
          "Ha ocurrido un error modificando el comentario"
        );
      },
    });
  }

  delete(commentId: number) {
    this.sweetAlertService.showQuestion(
      "¿Estás seguro que deseas eliminar el comentario?",
      "No podrás revertir esto",
    ).then((res) => {
      if (res.isConfirmed) {
        this.del(commentId).subscribe({
          next: () => {
            const deletedComments = this.commentsSignal().filter(
              (comment: IComment) => comment.commentId !== commentId
            );
            this.commentsSignal.set(deletedComments);
            this.sweetAlertService.showSuccess(
              "El comentario ha sido eliminado",
            );
          },
          error: (err: any) => {
            console.error("Error deleting comment", err);
            this.sweetAlertService.showError(
              "Ha ocurrido un error eliminando el comentario",
        
            );
          },
        });
      }
    });
  }
}
