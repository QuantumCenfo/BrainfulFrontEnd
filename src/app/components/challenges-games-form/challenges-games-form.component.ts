import { IChallengeGame, IBadge, IGame } from './../../interfaces/index';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-challenges-games-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './challenges-games-form.component.html',
  styleUrls: ['./challenges-games-form.component.scss']
})
export class ChallengesGamesFormComponent {
  @Input() title: string = 'Create Challenge';
  @Input() badgeList: IBadge[] = [];
  @Input() gameList: IGame[] = [];
  @Output() callParentEvent: EventEmitter<IChallengeGame> = new EventEmitter<IChallengeGame>();

  newChallengeGame: IChallengeGame = {
    badge: {
      badgeId: 1
    },
    game: {
      gameId: 1
    }
  };

  constructor(private challengeGameService: ChallengeGameService) {}

  addChallenge() {
    this.challengeGameService.save(this.newChallengeGame);
    this.callParentEvent.emit(this.newChallengeGame);
  }
}

