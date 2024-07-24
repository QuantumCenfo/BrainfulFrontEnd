import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IBadge, IUserBadge } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class UserBadgeService extends BaseService<IUserBadge> {
  protected override source: string = "userbadge";

  private userBadgeSignal = signal<IUserBadge[]>([]);

  get userBadges$() {
    return this.userBadgeSignal;
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
