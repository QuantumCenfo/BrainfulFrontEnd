import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IBadge } from "../interfaces";
import { from } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BadgeService extends BaseService<IBadge> {
  protected override source: string = "badges";

  private badgeSignal = signal<IBadge[]>([]);

  get badges$() {
    return this.badgeSignal;
  }

  getAllBadges() {
    this.findAll().subscribe({
      next: (res: any) => {
        res.reverse();
        this.badgeSignal.set(res);
        console.log("Badges fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching badges", err);
      },
    });
  }

  addBadge(badge: IBadge, imageFile: File) {
    const formData = new FormData();

    formData.append("badge", JSON.stringify(badge));
    formData.append("image", imageFile);

    return this.http.post(this.source, formData, {
      headers: new HttpHeaders({}),
    });
  }

  updateBadge(badge: IBadge) {
    this.edit(badge.badgeId, badge).subscribe({
      next: (res: any) => {
        const updatedBadges = this.badgeSignal().map((b) =>
          b.badgeId === badge.badgeId ? res : b
        );
        this.badgeSignal.set(updatedBadges);
        console.log("Response: ", res);
        console.log("Badge updated successfully");
      },
      error: (err: any) => {
        console.error("Error updating badge", err);
      },
    });
  }

  deleteBadge(badgeId: number) {
    this.del(badgeId).subscribe({
      next: () => {
        const deletedBadge = this.badgeSignal().filter(
          (badge: IBadge) => badge.badgeId !== badgeId
        );
        this.badgeSignal.set(deletedBadge);

        console.log("Badge deleted successfully");
      },
      error: (err: any) => {
        console.error("Error deleting badge", err);
      },
    });
  }
}
