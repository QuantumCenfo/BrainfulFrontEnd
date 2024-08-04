import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IForm } from "../interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import { SweetAlertService } from "./sweet-alert-service.service";

@Injectable({
  providedIn: "root",
})
export class FormService extends BaseService<IForm> {
  protected override source: string = "forms";
  private formsListSignal = signal<IForm[]>([]);

  get forms$() {
    return this.formsListSignal;
  }
  constructor(
  
    private sweetAlertService: SweetAlertService
  ) {
    super();
  }

  public save(item: IForm) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.formsListSignal.update((results: IForm[]) => [
          response,
          ...results,
        ]);
        this.sweetAlertService.showSuccess(
          "Recomendación Guardada",
        );
      },
      error: (error: any) => {
        this.sweetAlertService.showError(
          "El servicio de recomendaciones no está disponible en este momento. Inténtelo más tarde",
        );
      },
    });
  }
}
