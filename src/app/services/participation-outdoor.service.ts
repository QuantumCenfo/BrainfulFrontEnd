import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IPartcipationOutdoor } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ParticipationOutdoorService extends BaseService<IPartcipationOutdoor> {
  protected override source: string = "participationsOutdoor";

  public participationOutdoorSignal = signal<IPartcipationOutdoor[]>([]);

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


  
}

