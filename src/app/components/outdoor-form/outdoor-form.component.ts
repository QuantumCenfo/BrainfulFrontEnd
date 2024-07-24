import { ChallengeGameService } from './../../services/challenge-game.service';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IChallengeOutdoor } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outdoor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './outdoor-form.component.html',
  styleUrl: './outdoor-form.component.scss'
})
export class OutdoorFormComponent {
  @Input() ourDoorChallenge: IChallengeOutdoor = {} as IChallengeOutdoor;
  public modalService = inject(NgbModal);
  private challengeGameService = inject(ChallengeGameService);
 
 
  private router = inject(Router);

}
