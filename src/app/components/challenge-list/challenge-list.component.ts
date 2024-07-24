import { Component, inject, Input } from '@angular/core';
import { IChallengeGame, IChallengeOutdoor } from '../../interfaces';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeOutdoorService } from '../../services/challenge-outdoor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { OutdoorFormComponent } from '../outdoor-form/outdoor-form.component';

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
  private outDoorChallenge = inject(ChallengeOutdoorService);
  private gameChallengService = inject(ChallengeGameService);
  public currentOutDoorChallenge: IChallengeOutdoor = {
  };

  private challengeService = inject(ChallengeGameService);
  private outDoorService = inject(ChallengeOutdoorService);

  public modalService = inject(NgbModal);

  showDetail(challengeOutdoor: IChallengeOutdoor, modal: any) {
    this.currentOutDoorChallenge = { ...challengeOutdoor };
    modal.show();
    console.log(challengeOutdoor);
  }
}
