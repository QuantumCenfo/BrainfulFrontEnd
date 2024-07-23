import { IChallengeGame, IBadge, IGame } from './../../interfaces/index';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { Component, EventEmitter, Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-challenges-games-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './challenges-games-update-form.component.html',
  styleUrl: './challenges-games-update-form.component.scss'
})
export class ChallengesGamesFormComponent {
  @Input() title: string = '';
  @Input() toUpdateDateChallengeGame: IChallengeGame = {
    badge:{
      badgeId:1
    },
    game:{
      gameId:1
    }
  };
  @Input() badgeList :IBadge[] = [];
  @Input() gameList :IGame[] = [];
  @Output() callParentEvent: EventEmitter<IChallengeGame> = new EventEmitter<IChallengeGame>();

  addEdit()  {
    this.callParentEvent.emit(this.toUpdateDateChallengeGame);
  }
}