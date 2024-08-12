import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IReminder } from '../interfaces/index';
import { SweetAlertService } from './sweet-alert-service.service';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class ReminderService extends BaseService<IReminder> {
  public override source: string = 'api/reminders';

  constructor(protected override http: HttpClient, private sweetAlertService: SweetAlertService) {
    super();
  }

  getRemindersByUser(userId: number): Observable<IReminder[]> {
    return this.http.get<IReminder[]>(`${this.source}/user/${userId}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addReminder(reminder: IReminder): Observable<IReminder> {
    return this.http.post<IReminder>(this.source, reminder).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateReminder(id: number, reminder: IReminder): Observable<IReminder> {
    return this.http.put<IReminder>(`${this.source}/${id}`, reminder).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteReminder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.source}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: any): Observable<never> {
    this.sweetAlertService.showError('An error occurred', error.message);
    return throwError(() => new Error('Error occurred, please try again later.'));
  }
}
