import { Component, inject, Input, ViewChild } from '@angular/core';
import { IChallengeGame } from '../../interfaces';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { ChallengesGamesUpdateFormComponent } from '../challenges-games-update-form/challenges-games-update-form.component';
import { AddButtonComponent } from "../add-button/add-button.component";
import { ChallengesGamesFormComponent } from "../challenges-games-form/challenges-games-form.component";
import { BadgeService } from '../../services/badge.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-challenges-games-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, ModalComponent, ChallengesGamesUpdateFormComponent, AddButtonComponent, ChallengesGamesFormComponent],
  templateUrl: './challenges-games-list.component.html',
  styleUrl: './challenges-games-list.component.scss'
})
export class ChallengeGamesListComponent {
  @Input() activeChallengeGameList: IChallengeGame[] = [];
  @Input() inactiveChallengeGameList: IChallengeGame[] = [];
  public selectedChallengeGame: IChallengeGame = {};
  public challengeGameService = inject(ChallengeGameService);
  public modalService = inject(NgbModal);
  public badgeService = inject(BadgeService);
  public gameService = inject(GameService);
  @ViewChild("formModalUpdate") formModalUpdate!: ModalComponent;
  @ViewChild("formModal") formModal!: ModalComponent;
  ngOnInit(): void {
    this.badgeService.getAllBadges();
    this.gameService.getAllSignal();
    this.challengeGameService.getAllActiveChallenges();
    this.challengeGameService.getAllInactiveChallenges();
  }

  showModalUpdate(item: IChallengeGame) {
    this.selectedChallengeGame = {...item};
    this.formModalUpdate.show();
  }

  onFormUpdateEventCalled (params: IChallengeGame) {
    console.log('Challenge Game Data to Save:', params);
    this.challengeGameService.updateDateChallengeGame(params);
    this.modalService.dismissAll();
  }
  onFormEventCalled (params: IChallengeGame) {
    console.log('Challenge Game Data to Save:', params);
    this.challengeGameService.save(params);
    this.modalService.dismissAll();
  }

  showModal() {
    this.formModal.show();
  }
}
