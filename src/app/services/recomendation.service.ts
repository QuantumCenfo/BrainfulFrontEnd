import { Injectable, signal } from "@angular/core";
import { IRecomendation, IResponse, IUser } from "../interfaces";
import { BaseService } from "./base-service";
import { Observable } from "rxjs";
import { SweetAlertService } from "./sweet-alert-service.service";

@Injectable({
  providedIn: "root",
})
export class RecomendationService extends BaseService<IRecomendation> {
  protected override source: string = "recommendations";
  private recommendationSignal = signal<IRecomendation[]>([]);
 
  private user: IUser = { email: "", authorities: [] };

  constructor(private sweetAlertService: SweetAlertService) {
    super();
  }

  get recomendations$() {
    return this.recommendationSignal;
  }

  public override find(id: string | number): Observable<IResponse<IRecomendation>> {
    return this.http.get<IResponse<IRecomendation>>(
      `${this.source}/user/${id}`
    );
  }

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }

  public getAllRecomendationsById() {
    const user_id: number | undefined = this.getUserIdFromLocalStorage();
    if (user_id !== undefined) {
      this.find(user_id).subscribe({
        next: (response: any) => {
          response.reverse();
          this.recommendationSignal.set(response);
          console.log(response);
        },
        error: (error: any) => {
          console.log("error", error);
        },
      });
    } else {
      console.error("User ID is undefined.");
    }
  }

  public delete(recommendation: IRecomendation) {
    this.sweetAlertService.showQuestion(
      "¿Está seguro que desea eliminar la recomendación?",
      "No podrá recuperar la información",
    ).then((res) => {
      if (res.isConfirmed) {
        this.del(recommendation.recommendationId).subscribe({
          next: () => {
            const updatedItems = this.recommendationSignal().filter(
              (r: IRecomendation) => r.recommendationId != recommendation.recommendationId
            );
            this.recommendationSignal.set(updatedItems);
            this.sweetAlertService.showSuccess("La recomendación ha sido eliminada", " ");
          },
          error: (error: any) => {
            console.error("error", error);
            this.sweetAlertService.showError("Hubo un problema al eliminar la recomendación", " ");
          },
        });
      }
    });
  }
}
