import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IForm } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    },
    error: (error : any) => {
      this.snackBar.open(error.error.description, 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      console.error('error', error);
      console.error('error', error);
    }
  })
} 

}
