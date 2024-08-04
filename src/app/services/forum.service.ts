import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IForum, IResponse } from "../interfaces";
import { HttpClient } from "@angular/common/http";
import { SweetAlertService } from "./sweet-alert-service.service";

@Injectable({
  providedIn: "root",
})
export class ForumService extends BaseService<IForum> {
  protected override source: string = "forums";
  private forumsSignal = signal<IForum[]>([]);

  constructor(
    public override http: HttpClient,
    private sweetAlertService: SweetAlertService
  ) {
    super();
  }

  get forums$() {
    return this.forumsSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.forumsSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching forums", error);
        this.sweetAlertService.showError("Error fetching forums", " ");
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
          this.sweetAlertService.showError("Error fetching forums", "#16c2d5");
        },
      });
  }

  deleteForum(forumId: number) {
    this.sweetAlertService.showQuestion(
      "¿Estás seguro que deseas eliminar el foro?",
      "No podrás revertir esto",
    ).then((res) => {
      if (res.isConfirmed) {
        this.del(forumId).subscribe({
          next: () => {
            const deletedForum = this.forumsSignal().filter(
              (forum: IForum) => forum.forumId !== forumId
            );
            this.forumsSignal.set(deletedForum);
            this.sweetAlertService.showSuccess("El foro ha sido eliminado", " ");
          },
          error: (err: any) => {
            console.error("Error deleting forum", err);
            this.sweetAlertService.showError("Ha ocurrido un error eliminando el foro", " ");
          },
        });
      }
    });
  }

  public save(item: IForum) {
    item.anonymous = item.anonymous == null ? false : item.anonymous;
    this.add(item).subscribe({
      next: (response: any) => {
        this.forumsSignal.update((forums: IForum[]) => [response, ...forums]);
        this.sweetAlertService.showSuccess("El foro ha sido agregado", " ");
      },
      error: (error: any) => {
        console.error("Error adding forum", error);
        this.sweetAlertService.showError("Ha ocurrido un error agregando el foro", " ");
      },
    });
  }
}
