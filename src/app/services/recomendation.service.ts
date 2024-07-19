import { inject, Injectable, signal } from '@angular/core';
import {IRecomendation, IResponse, IUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseService } from './base-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecomendationService extends BaseService<IRecomendation>{
protected override source: string = 'recommendations';
private recommendationSignal = signal<IRecomendation[]>([]);
private snackBar = inject(MatSnackBar);
private user: IUser = { email: '', authorities: [] };

get recomendations$() {
  return this.recommendationSignal;
}
public override find(id: string | number): Observable<IResponse<IRecomendation>> {
  return this.http.get<IResponse<IRecomendation>>(this.source + '/' +'user'+'/'+ id);
}
getUserIdFromLocalStorage(): number | undefined {
  const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    const user = JSON.parse(authUser);
    return user.id ? Number(user.id) : undefined;
  }
  return undefined;
}
public geAllRecomendationsById() {
  const user_id: number | undefined = this.getUserIdFromLocalStorage();
  if (user_id !== undefined) {
    this.find(user_id).subscribe({
      next: (response: any) => {
        response.reverse();
        this.recommendationSignal.set(response);
        console.log(response);
      },
      error: (error: any) => {
        console.log('error', error);
      }
    });
  } else {
    console.error('User ID is undefined.');
  }
}

  public delete(recomendation: IRecomendation) {
    this.del(recomendation.recommendationId).subscribe({
      next: () => {
        const updatedItems = this.recommendationSignal().filter((r: IRecomendation) => r.recommendationId !=recomendation.recommendationId);
        this.recommendationSignal.set(updatedItems);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
      }
    })
  }
}
