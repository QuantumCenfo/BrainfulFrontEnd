import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IForm } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FormService extends BaseService<IForm>{
  protected override source: string = "forms";
  private snackBar = inject(MatSnackBar);
  private formsListSignal = signal<IForm[]>([]);

  get forms$() {
    return this.formsListSignal;
  }

  
public save(item: IForm) {
  this.add(item).subscribe({
    next: (response: any) => {
      this.formsListSignal.update((results: IForm[]) => [response, ...results]);
      Swal.fire({
        iconColor: "white",
        color: "white",
        background: "#36cf4f",
        confirmButtonColor: "#ff9f1c",
        cancelButtonColor: "#16c2d5",
        title: "Recomendacion Guardada",
        icon: "success",
        timer: 10000,
        showConfirmButton: false,
        showCancelButton: false,
      });
    },
    error: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Lo sentimos',
        iconColor: 'white',
        color: 'white',
        background:'#d54f16',
        position: 'center',
        text: 'El servicio de recomendaciones no esta disponible en este momento.Intentelo más tarde',
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
      });
    }
  })
} 

}
