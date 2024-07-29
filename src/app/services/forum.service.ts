import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IComment, IForum, IResponse } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import Swal from "sweetalert2";

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
        console.error("Error fetching games", error);
      },
    });
  }

  getMySignal(userId: number) {
    this.http
      .get<IResponse<IForum[]>>(`${this.source}/UserId/${userId}`)
      .subscribe({
        next: (response: any) => {
          response.reverse();
          this.forumsSignal.set(response);
        },
        error: (error: any) => {
          console.error("Error fetching forums", error);
        },
      });
  }

  deleteForum(forumId: number) {
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el foro?",
      text: "No podrás revertir esto",
      icon: "warning",
      iconColor: "white",
      color: "white",
      background: "#d54f16",
      position: "center",
      confirmButtonColor: "#ff9f1c",
      cancelButtonColor: "#16c2d5",
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.del(forumId).subscribe({
          next: () => {
            const deletedForum = this.forumsSignal().filter(
              (forum: IForum) => forum.forumId !== forumId
            );
            this.forumsSignal.set(deletedForum);
            Swal.fire({
              title: "¡Éxito!",
              text: "El foro ha sido eliminado",
              icon: "success",
              iconColor: "white",
              color: "white",
              showConfirmButton: false,
              background: "#16c2d5",
              timer: 2000,
            });
          },
          error: (err: any) => {
            console.error("Error deleting forum", err);
            Swal.fire({
              title: "Oops...",
              text: "Ha ocurrido un error eliminando el foro",
              icon: "warning",
              iconColor: "white",
              color: "white",
              background: "#16c2d5",
              timer: 2000,
            });
          },
        });
      }
    });
  }

  public save(item: IForum) {
    item.anonymous = item.anonymous == null ? false : item.anonymous;
    this.add(item).subscribe({
      next: (response: any) => {
        console.log(this.forumsSignal());
        this.forumsSignal.update((forums: IForum[]) => [response, ...forums]);
        console.log(this.forumsSignal());
        Swal.fire({
          title: "¡Éxito!",
          text: "El foro ha sido agregado",
          icon: "success",
          iconColor: "white",
          color: "white",
          showConfirmButton: false,
          background: "#16c2d5",
          timer: 2000,
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error.description, "Close", {
          horizontalPosition: "right",
          verticalPosition: "top",
          panelClass: ["error-snackbar"],
        });
        console.error("error", error);
        Swal.fire({
          title: "Oops...",
          text: "Ha ocurrido un error agregando el foro",
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
