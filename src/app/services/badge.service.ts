import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IBadge } from "../interfaces";
import { from } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class BadgeService extends BaseService<IBadge> {
  protected override source: string = "badges";

  public badgeSignal = signal<IBadge[]>([]);

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

  handleAddBadge(badge: IBadge, imageFile: File) {
    if (imageFile) {
      this.addBadge(badge, imageFile).subscribe({
        next: (res: any) => {
          this.badgeSignal.update((badges: any) => [res, ...badges]);
          console.log("Response: ", res);
          console.log("Badge added successfully");
          Swal.fire({
            title: "¡Éxito!",
            text: "La insignia ha sido agregada",
            icon: "success",
            iconColor: "white",
            color: "white",
            background: "#16c2d5",
            confirmButtonColor: "#ff9f1c",
          });
        },
        error: (err: any) => {
          console.log("Error: ", err);
        },
      });
    } else {
      Swal.fire({
        title: "Oops...",
        text: "Porfavor suba una imagen",
        icon: "warning",
        iconColor: "white",
        color: "white",
        background: "#16c2d5",
        confirmButtonColor: "#ff9f1c",
      });
    }
  }

  updateBadge(badge: IBadge, imageFile: File) {
    const formData = new FormData();
    formData.append("badge", JSON.stringify(badge));
    formData.append("image", imageFile);

    return this.http.put(this.source + "/" + badge.badgeId, formData);
  }

  handleUpdateBadge(badge: IBadge, imageFile: File) {
    Swal.fire({
      title: "Esta seguro que desea actualizar la medalla?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, actualizar",
    }).then((res) => {
      if (imageFile) {
        this.updateBadge(badge, imageFile).subscribe({
          next: (res: any) => {
            const updatedBadge = this.badgeSignal().map((b: IBadge) =>
              b.badgeId === badge.badgeId ? badge : b
            );
            this.badgeSignal.set(updatedBadge);
            console.log("Response: ", res);
            console.log("Badge updated successfully");
            Swal.fire({
              title: "¡Éxito!",
              text: "La insignia ha sido actualizada",
              icon: "success",
              iconColor: "white",
              color: "white",
              background: "#16c2d5",
              timer: 2000,
            });
          },
          error: (err: any) => {
            console.log("Error: ", err);
          },
        });
      } else {
        Swal.fire({
          title: "Oops...",
          text: "Porfavor subir una imagen",
          icon: "warning",
          iconColor: "white",
          color: "white",
          background: "#16c2d5",
          confirmButtonColor: "#ff9f1c",
        });
      }
    });
  }

  deleteBadge(badgeId: number) {
    Swal.fire({
      title: "Seguro que desea eliminar la medalla?",
      text: "No podrá recuperar la información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then((res) => {
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
    });
  }
}
