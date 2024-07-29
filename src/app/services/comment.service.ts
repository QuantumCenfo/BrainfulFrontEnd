import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IComment, IForum, IResponse } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class CommentService extends BaseService<IComment> {
  protected override source: string = "comments";
  private commentsSignal = signal<IComment[]>([]);
  private snackBar = inject(MatSnackBar);

  get comments$() {
    return this.commentsSignal;
  }
 
  //Get all games 
  getCommentsSignal(forumId: string) {
    this.http.get<IResponse<IComment[]>>(`${this.source}/${forumId}`).subscribe({
      next: (response: any) => {
        response.reverse();
        this.commentsSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching forums', error);
      }
    });
  }

  public save(item: IComment) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.commentsSignal.update((forums: IComment[]) => [response, ...forums]);
        Swal.fire({
          title: "¡Éxito!",
          text: "El comentario ha sido agregado",
          icon: "success",
          iconColor: "white",
          color: "white",
          showConfirmButton: false,
          background: "#16c2d5",
          timer: 2000,
        });
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
        Swal.fire({
          title: "Oops...",
          text: "Ha ocurrido un error agregando el comentario",
          icon: "warning",
          iconColor: "white",
          color: "white",
          background: "#16c2d5",
          timer: 2000,
        });
      }
    })
  } 
 
  public update(item: IComment) {
    this.edit(item.commentId, item).subscribe({
      next: () => {
        const updatedItems = this.commentsSignal().map(comment => comment.commentId === item.commentId ? item : comment);
        this.commentsSignal.set(updatedItems);
        Swal.fire({
          title: "¡Éxito!",
          text: "El comentario ha sido modificado",
          icon: "success",
          iconColor: "white",
          color: "white",
          showConfirmButton: false,
          background: "#16c2d5",
          timer: 2000,
        });
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
        Swal.fire({
          title: "Oops...",
          text: "Ha ocurrido un error modificando el comentario",
          icon: "warning",
          iconColor: "white",
          color: "white",
          background: "#16c2d5",
          timer: 2000,
        });
      }
    })
  }

  delete(commentId: number) {
    this.del(commentId).subscribe({
      next: () => {
        const deletedForum = this.commentsSignal().filter(
          (comment: IComment) => comment.commentId !== commentId
        );
        this.commentsSignal.set(deletedForum);
        Swal.fire({
          title: "¡Éxito!",
          text: "El comentario ha sido eliminado",
          icon: "success",
          iconColor: "white",
          color: "white",
          showConfirmButton: false,
          background: "#16c2d5",
          timer: 2000,
        });
      },
      error: (err: any) => {
        console.error("Error deleting badge", err);
        Swal.fire({
          title: "Oops...",
          text: "Ha ocurrido un error eliminando el comentario",
          icon: "warning",
          iconColor: "white",
          color: "white",
          background: "#16c2d5",
          timer: 2000,
        });
      },
    });
  }

}
