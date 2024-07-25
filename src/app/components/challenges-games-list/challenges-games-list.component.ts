import { Component, inject, Input, ViewChild } from '@angular/core';
import { IChallengeGame } from '../../interfaces';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { ChallengesGamesUpdateFormComponent } from '../challenges-games-update-form/challenges-games-update-form.component';

@Component({
  selector: 'app-challenges-games-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, ModalComponent, ChallengesGamesUpdateFormComponent],
  templateUrl: './challenges-games-list.component.html',
  styleUrl: './challenges-games-list.component.scss'
})
export class ChallengeGamesListComponent {
  @Input() activeChallengeGameList: IChallengeGame[] = [];
  @Input() inactiveChallengeGameList: IChallengeGame[] = [];
  public selectedChallengeGame: IChallengeGame = {};
  public challengeGameService = inject(ChallengeGameService);
  public modalService = inject(NgbModal);
  @ViewChild("formModal") formModal!: ModalComponent;

  ngOnInit(): void {
    
  }

  showModal(item: IChallengeGame) {
    this.selectedChallengeGame = {...item};
    this.formModal.show();
  }

  onFormEventCalled (params: IChallengeGame) {
    console.log('Challenge Game Data to Save:', params);
    this.challengeGameService.updateDateChallengeGame(params);
    this.modalService.dismissAll();
  }
}
