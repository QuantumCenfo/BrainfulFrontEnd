import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IForum, IResponse } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class ForumService extends BaseService<IForum> {
  protected override source: string = "forums";
  private forumsListSignal = signal<IForum[]>([]);

  get forums$() {
    return this.forumsListSignal;
  }
  //Get all games 
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.forumsListSignal.set(response);
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
        this.forumsListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching forums', error);
      }
    });
  }
  
  
}
