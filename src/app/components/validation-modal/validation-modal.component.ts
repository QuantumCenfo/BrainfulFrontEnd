import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IChallengeOutdoor, IPartcipationOutdoor, IUser } from '../../interfaces';
import { ParticipationOutdoorService } from '../../services/participation-outdoor.service';

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

  isImageEnlarged = false;

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
