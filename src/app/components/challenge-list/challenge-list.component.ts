import { Component, inject, Input } from '@angular/core';
import { IChallengeGame, IChallengeOutdoor, IPartcipationOutdoor } from '../../interfaces';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeOutdoorService } from '../../services/challenge-outdoor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { OutdoorFormComponent } from '../outdoor-form/outdoor-form.component';
import Swal from 'sweetalert2';
import { ParticipationOutdoorService } from '../../services/participation-outdoor.service';

@Component({
  selector: 'app-challenge-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule,ModalComponent,OutdoorFormComponent],
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss'
})
export class ChallengeListComponent {
  @Input() outdoorChallengeList: IChallengeOutdoor[] = [];
  @Input() gameChallengeList: IChallengeGame[] = [];
  private participationServices = inject(ParticipationOutdoorService);
  private outDoorChallenge = inject(ChallengeOutdoorService);
  private gameChallengService = inject(ChallengeGameService);
  public currentOutDoorChallenge: IChallengeOutdoor = {
  };


  public modalService = inject(NgbModal);

  showDetail(challengeOutdoor: IChallengeOutdoor, modal: any) {
    this.currentOutDoorChallenge = { ...challengeOutdoor };
    modal.show();
    console.log(challengeOutdoor);
  }
  onFormEventCalled(event: { participation: IPartcipationOutdoor; file: File | null }) {
    if (event.file) {
      this.participationServices.addParticipation(event.participation, event.file).subscribe({
        next: (res: any) => {
          this.participationServices.participationOutdoorSignal.update((participations: any) => [
            res,
            ...participations,
          ]);
        },
        error: (err: any) => {
          console.log("Error: ", err);
        },
      });
    } else {
      Swal.fire({
        title: "Oops...",
        text: "Porfavor suba una imagen",
        icon: "warning",
        iconColor: "white",
        color: "white",
        background: "#16c2d5",
        confirmButtonColor: "#ff9f1c",
      });
    }
  }
}
