import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseService } from './base-service';
import { IGameResults } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ReactionGameService extends BaseService<IGameResults>{
  protected override source: string = "gameResults";

  private resultsListSignal = signal<IGameResults[]>([]);
  constructor(protected override http: HttpClient) {
    super();  
  }

  public save(item: IGameResults) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.resultsListSignal.update((results: IGameResults[]) => [response, ...results]);
      },
      error: (error : any) => {
       
        console.error('error', error);
        console.error('error', error);
      }
    })
  } 
}
