import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IForum, IResponse } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class ForumService extends BaseService<IForum> {
  protected override source: string = "forums";
  private forumsSignal = signal<IForum[]>([]);
  private snackBar = inject(MatSnackBar);

  get forums$() {
    return this.forumsSignal;
  }
  //Get all games 
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.forumsSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching games', error);
      }
    });
  }

  getMySignal(userId: number) {
    this.http.get<IResponse<IForum[]>>(`${this.source}/UserId/${userId}`).subscribe({
      next: (response: any) => {
        response.reverse();
        this.forumsSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching forums', error);
      }
    });
  }
  
  deleteForum(forumId: number) {
    this.del(forumId).subscribe({
      next: () => {
        const deletedForum = this.forumsSignal().filter(
          (forum: IForum) => forum.forumId !== forumId
        );
        this.forumsSignal.set(deletedForum);
      },
      error: (err: any) => {
        console.error("Error deleting badge", err);
      },
    });
  }

  public save(item: IForum) {
    console.log(item);
    this.add(item).subscribe({
      next: (response: any) => {
        this.forumsSignal.update((forums: IForum[]) => [response, ...forums]);
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

}
