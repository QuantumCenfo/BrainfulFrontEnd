import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IPartcipationOutdoor } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipationOutdoorService extends BaseService<IPartcipationOutdoor> {
  protected override source: string = "participationsOutdoor";

  public participationOutdoorSignal = signal<IPartcipationOutdoor[]>([]);
  constructor(public override http: HttpClient) {
    super();
  }
  get participations$() {
    return this.participationOutdoorSignal;
  }

  getAllParticipations() {
    this.findAll().subscribe({
      next: (res: any) => {
        res.reverse();
        this.participationOutdoorSignal.set(res);
        console.log("Participations fetched successfully");
        console.log("Response: ", res);
      },
      error: (err: any) => {
        console.error("Error fetching Participations", err);
      },
    });
  }
  updateParticipation(id: number, participation: IPartcipationOutdoor): Observable<IPartcipationOutdoor> {
  
    console.log(id);
    console.log(participation);
    return this.http.put<IPartcipationOutdoor>(`${this.source}/${id}`, participation);
  }


  
}

