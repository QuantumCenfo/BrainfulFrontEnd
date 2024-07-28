import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IComment, IForum, IResponse } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";

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
    console.log(item);
    this.add(item).subscribe({
      next: (response: any) => {
        this.commentsSignal.update((forums: IComment[]) => [response, ...forums]);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
      }
    })
  } 

  public update(item: IComment) {
    this.edit(item.commentId, item).subscribe({
      next: () => {
        const updatedItems = this.commentsSignal().map(comment => comment.commentId === item.commentId ? item : comment);
        this.commentsSignal.set(updatedItems);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
      }
    })
  }

  delete(forumId: number) {
    this.del(forumId).subscribe({
      next: () => {
        const deletedForum = this.commentsSignal().filter(
          (forum: IForum) => forum.forumId !== forumId
        );
        this.commentsSignal.set(deletedForum);
      },
      error: (err: any) => {
        console.error("Error deleting badge", err);
      },
    });
  }

}
