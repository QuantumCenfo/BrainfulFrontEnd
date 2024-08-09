import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IPartcipationOutdoor } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { SweetAlertService } from './sweet-alert-service.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipationOutdoorService extends BaseService<IPartcipationOutdoor> {
  public override source: string = "participationsOutdoor";

  public participationOutdoorSignal = signal<IPartcipationOutdoor[]>([]);
  constructor(
    public override http: HttpClient,
    private sweetAlertService: SweetAlertService
  ) {
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
  
      },
      error: (err: any) => {
        console.error("Error fetching Participations", err);
      },
    });
  }
   updateParticipation(id: number, participation: IPartcipationOutdoor): Observable<IPartcipationOutdoor> {
    console.log(participation);
    return this.http.put<IPartcipationOutdoor>(`${this.source}/${id}`, participation).pipe(
      catchError((error) => {
      
        this.sweetAlertService.showError("Error actualizando participación", " ");
        return throwError(() => new Error('Error  actualizando participación'));
      })
    );
  }
  addParticipation(participation: IPartcipationOutdoor, imageFile: File) {
    
    const formData = new FormData();
    formData.append("participationOutdoor", JSON.stringify(participation));
    formData.append("image", imageFile);
    this.sweetAlertService.showSuccess("La participación ha sido agregada", " ");
    return this.http.post(this.source, formData, {
      
      headers: new HttpHeaders({}),
      
    }).pipe(
      
      catchError((error) => {
        
        this.sweetAlertService.showWarning(
          "No puedes volver a completar el desafío hasta que tu intento sea revisado",
          "#d54f16"
        );
        return throwError(() => new Error('Error al agregar la participación'));
      })
    );
  }


  
}

