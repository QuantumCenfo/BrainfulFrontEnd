import { ChallengeGameService } from './../../services/challenge-game.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IBadge, IChallengeOutdoor, IPartcipationOutdoor, IUser } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outdoor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './outdoor-form.component.html',
  styleUrl: './outdoor-form.component.scss'
})
export class OutdoorFormComponent {
  @Input() outDoorChallenge: IChallengeOutdoor = {
    outdoorChallengeId:0
  } as IChallengeOutdoor;
  public modalService = inject(NgbModal);
  private challengeGameService = inject(ChallengeGameService);
  private router = inject(Router);
  user_id: number | undefined = this.getUserIdFromLocalStorage();
  participation: IPartcipationOutdoor = {
    status:"pendiente",
    fechaPublicacion: new Date().toISOString().split('T')[0],
    user: this.user_id as IUser,
    challengeOutdoor: this.outDoorChallenge.outdoorChallengeId as IChallengeOutdoor
  };
  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }
  @Input() actualFile: File | null = null;
  @Input() btn = "";
  file: File | null = null;
  @Output() callParentEvent = new EventEmitter<{
    participation: IPartcipationOutdoor;
    file: File | null;
  }>();
  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  addParticipation() {

    console.log(this.participation)
    this.callParentEvent.emit({ participation: this.participation, file: this.file });
    this.modalService.dismissAll();
  }
}
