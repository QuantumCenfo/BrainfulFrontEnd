import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  showAlert(
    title: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question',
    background: string = '#fff',
    iconColor: string = '#000',
    color:string = "white",
    confirmButtonColor: string = '#ff9f1c',
    cancelButtonColor: string = '#16c2d5',
    timer: number = 3000,
    showConfirmButton: boolean = false,
    showCancelButton: boolean = false,
    text?: string
  ) {
    return Swal.fire({
      title,
      text,
      icon,
      color,
      background,
      iconColor,
      confirmButtonColor,
      cancelButtonColor,
      timer,
      timerProgressBar: true,
      showConfirmButton,
      showCancelButton,
    });
  }

  showSuccess(title: string, text?: string) {
    return this.showAlert(title, 'success', '#36cf4f', 'white','white', '#ff9f1c', '#16c2d5', 3000, false, false, text);
  }

  showError(title: string, text?: string) {
    return this.showAlert(title, 'error', '#d54f16', 'white','white', '#ff9f1c', '#16c2d5', 3000, false, false, text);
  }

  showWarning(title: string, text?: string) {
    return this.showAlert(title, 'warning', '#d54f16', 'white','white' ,'#3085d6', '#aaa', undefined, true, false, text);
  }
  showQuestion(title: string, text?: string) {
    return this.showAlert(title, 'question', '#d54f16', 'white','white', '#ff9f1c', '#16c2d5', 6000, true, true,text);
  }
}
