import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IBadge, IUserBadge } from "../interfaces";
import { Observable, tap, catchError, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class UserBadgeService extends BaseService<IUserBadge> {
  protected override source: string = "userbadge";

  private userBadgeSignal = signal<IUserBadge[]>([]);

  get userBadges$() {
    return this.userBadgeSignal;
  }
  
  public save(userBadge: IUserBadge) {
    this.add(userBadge).subscribe({
      next: (response: any) => {
        this.userBadgeSignal.update((results: IUserBadge[]) => [response, ...results]);
      },
      error: (error : any) => {
      
        console.error('error', error);
        console.error('error', error);
      }
    })
  } 
 
  getUserBadges(userId: number) {
    this.findAll().subscribe({
      next: (res: any) => {
        res.reverse();
        this.userBadgeSignal.set(res);
        console.log("User badges fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching user badges", err);
      },
    });
  }
}
