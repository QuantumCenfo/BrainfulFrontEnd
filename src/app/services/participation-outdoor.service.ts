import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IPartcipationOutdoor } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

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
  addParticipation(participation: IPartcipationOutdoor, imageFile: File) {
    const formData = new FormData();
    formData.append("participationOutdoor", JSON.stringify(participation));
    formData.append("image", imageFile);

    return this.http.post(this.source, formData, {
      headers: new HttpHeaders({}),
      
    }).pipe(
      
      catchError((error) => {
        
        Swal.fire({
          icon: 'warning',
          title: 'Lo sentimos',
          iconColor: 'white',
          color: 'white',
          background:'#d54f16',
          position: 'center',
          text: 'No puedes volver a completar el desafio hasta que tu intento sea revisado ',
          showConfirmButton: false,
          timer: 10000,
          timerProgressBar: true,
        });
        return throwError(() => new Error('Error al agregar la participación'));
      })
    );
  }


  
}

