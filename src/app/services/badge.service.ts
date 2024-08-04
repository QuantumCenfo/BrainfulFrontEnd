import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IBadge } from "../interfaces";
import { catchError, from, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { SweetAlertService } from "./sweet-alert-service.service";

@Injectable({
  providedIn: "root",
})
export class BadgeService extends BaseService<IBadge> {
  public override source: string = "badges";

  public badgeSignal = signal<IBadge[]>([]);

  get badges$() {
    return this.badgeSignal;
  }

  constructor(
    
    private sweetAlertService: SweetAlertService 
  ) {
    super();
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
    if (imageFile) {
      formData.append("image", imageFile);
    }

    return this.http.post(this.source, formData, {
      headers: new HttpHeaders({}),
    });
  }

  handleAddBadge(badge: IBadge, imageFile: File) {
    this.addBadge(badge, imageFile).subscribe({
      next: (res: any) => {
        this.badgeSignal.update((badges: any) => [res, ...badges]);

        this.sweetAlertService.showSuccess(
          "La insignia ha sido agregada"
        );
      },
      error: (err: any) => {
        this.sweetAlertService.showError(
          "Hubo un problema agregando la insignia"
        );
      },
    });
  }

  updateBadge(badge: IBadge, imageFile: File) {
    const formData = new FormData();
    formData.append("badge", JSON.stringify(badge));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    return this.http.put(this.source + "/" + badge.badgeId, formData);
  }

  handleUpdateBadge(badge: IBadge, imageFile: File) {
    this.sweetAlertService.showQuestion(
      "¿Está seguro que desea actualizar la medalla?",
   "No podrás revertir esto"
    ).then((res) => {
      if (res.isConfirmed) {
        this.updateBadge(badge, imageFile).subscribe({
          next: (res: any) => {
            const updatedBadge = this.badgeSignal().map((b: IBadge) =>
              b.badgeId === badge.badgeId ? badge : b
            );
            this.badgeSignal.set(updatedBadge);
            
            this.sweetAlertService.showSuccess(
              "La insignia ha sido actualizada"
            );
          },
          error: (err: any) => {
            console.log("Error: ", err);
          },
        });
      }
    });
  }

  deleteBadge(badgeId: number) {
    this.sweetAlertService.showQuestion(
      "¿Está seguro que desea eliminar la medalla?",
      "No podrá recuperar la información",
  
    ).then((res) => {
      if (res.isConfirmed) {
        this.del(badgeId).subscribe({
          next: () => {
            const deletedBadge = this.badgeSignal().filter(
              (badge: IBadge) => badge.badgeId !== badgeId
            );
            this.badgeSignal.set(deletedBadge);
            this.sweetAlertService.showSuccess(
              "La insignia ha sido eliminada"
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
    });
  }
}
