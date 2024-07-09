import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseService } from './base-service';
import { IGameResults } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MemoryService extends BaseService<IGameResults> {
  protected override source: string = "gameResults";
  private snackBar = inject(MatSnackBar);
  private urlApi = 'https://api.unsplash.com';
  private accessKey = 'gnof3h7Xoxkw_ZN6GY0ErzH6BFoKCRe-choP-c8WR2g';
  private resultsListSignal = signal<IGameResults[]>([]);
  constructor(protected override http: HttpClient) {
    super(); 
  }
//Get de imagenes random del api
  getRandomImages(count: number): Observable<string[]> {
    const url = `${this.urlApi}/photos/random?client_id=${this.accessKey}&count=${count}`;
    return this.http.get<any[]>(url).pipe(
      map(response => response.map(photo => photo.urls.small))
    );
  }

//Salva los resultados del juego
  public save(item: IGameResults) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.resultsListSignal.update((results: IGameResults[]) => [response, ...results]);
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
