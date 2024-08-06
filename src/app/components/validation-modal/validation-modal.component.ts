import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IChallengeOutdoor, IPartcipationOutdoor, IUser, IUserBadge } from '../../interfaces';
import { ParticipationOutdoorService } from '../../services/participation-outdoor.service';
import { UserBadgeService } from '../../services/user-badge.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import { SweetAlertService } from '../../services/sweet-alert-service.service';


@Component({
  selector: 'app-validation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss']
})
export class ValidationModalComponent {
  @Input() title!: string;
  @Input() participation: IPartcipationOutdoor = {} as IPartcipationOutdoor;
  public modalService = inject(NgbModal);
  private participationOutdoorService = inject(ParticipationOutdoorService);
  private userBadgeservice = inject(UserBadgeService);
  isImageEnlarged = false;
  public alertService = inject(SweetAlertService);
  private router = inject(Router);
 
  toggleImageSize(): void {
    this.isImageEnlarged = !this.isImageEnlarged;
  }

  acceptParticipation(): void {
    if (this.participation.participationOutdoorId === undefined) {
      console.error('Participation ID is undefined');
      return;
    }
    const updatedParticipation = {
     
      status: 'revisado',
      fechaRevision: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };
    if (this.participation?.user?.id && this.participation?.challengeOutdoor?.badgeId) {
      const userBadge: IUserBadge = {
        obtainedDate: new Date().toISOString(),
        user: { id: this.participation.user.id },
        badge: { badgeId: this.participation.challengeOutdoor.badgeId.badgeId }
      };
      this.userBadgeservice.save(userBadge);
      this.alertService.showSuccess('Participacion Validada').then((result) => {
        if (this.participation.user?.email && this.participation.user?.name) {
          console.log(this.participation.user.email,this.participation.user.name)
          this.sendEmail(
            this.participation.user.email, 
            'Participacion Aceptada',
            `Hola ${this.participation.user.name},
      
            Tiene un nuevo mensaje de Brainful Staff:
      
            Su participación ha sido aceptada. Se le ha otorgado la insignia!
      
            Saludos,
            Brainful Staff`
          );
        }
      });
    } 
    this.participationOutdoorService.updateParticipation(this.participation.participationOutdoorId, updatedParticipation).subscribe({
      next: (res) => {
        console.log("Participation updated successfully", res);
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error("Error updating participation", err);
      }
    });
    
  }
  sendEmail(to: string, subject: string, message: string): void {
    const serviceId = 'service_7wral9p';
    const templateId = 'template_qqyqznx';
    const userId = 'LT6L-YQxI4TSU-Ekr';
    const templateParams = {
      to_email: to,
      to_name: this.participation.user?.name,  
      from_name: 'Brainful Staff',  
      message: message  
    };

    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        console.log('Email sent successfully', response.status, response.text);
      }, (error) => {
        console.error('Error sending email', error);
      });
      // window.location.reload();
  }
  deniedParticipation(): void {
    if (this.participation.participationOutdoorId === undefined) {
      console.error('Participation ID is undefined');
      return;
    }
    const updatedParticipation = {
      status: 'rechazada',
      fechaRevision: new Date().toISOString().split('T')[0] 
    };
    if (this.participation.user?.email && this.participation.user?.name) {
      console.log(this.participation.user.email,this.participation.user.name)
      this.sendEmail(
        this.participation.user.email, 
        'Participacion Rechazada',
        `Hola ${this.participation.user.name},
  
        Tiene un nuevo mensaje de Brainful Staff:
  
        Su participación ha sido reachazada ya que no cumple con los requisitos.
  
        Saludos,
        Brainful Staff`
      );
    } 
    this.participationOutdoorService.updateParticipation(this.participation.participationOutdoorId, updatedParticipation).subscribe({
      next: (res) => {
        console.log("Participation updated successfully", res);
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error("Error updating participation", err);
      }
    });
  }
}
