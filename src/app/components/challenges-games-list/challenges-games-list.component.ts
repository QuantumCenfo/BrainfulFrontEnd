import { Component, inject, Input } from '@angular/core';
import { IChallengeGame } from '../../interfaces';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-challenges-games-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, ModalComponent],
  templateUrl: './challenges-games-list.component.html',
  styleUrl: './challenges-games-list.component.scss'
})
export class ChallengeGamesListComponent {
  @Input() activeChallengeGameList: IChallengeGame[] = [];
  @Input() inactiveChallengeGameList: IChallengeGame[] = [];
  public challengeGameService = inject(ChallengeGameService);
  public modalService = inject(NgbModal);

  ngOnInit(): void {
    
  }


}
