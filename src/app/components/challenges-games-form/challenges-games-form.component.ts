import { GameService } from './../../services/game.service';
import { inject, OnInit } from '@angular/core';
import { IChallengeGame, IBadge, IGame } from './../../interfaces/index';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeService } from '../../services/badge.service';

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
export class ChallengesGamesFormComponent implements OnInit{
  public badgeService = inject(BadgeService);
  public gameService = inject(GameService);
  public challengeGameService = inject(ChallengeGameService);

  @Input() titleComp: string = 'Add Challenge';
  @Input() badgeList: IBadge[] = [];
  @Input() gameList: IGame[] = [];
  @Output() callParentEvent: EventEmitter<IChallengeGame> = new EventEmitter<IChallengeGame>();

  @Input() newChallengeGame: IChallengeGame = {
    badgeId: {
      badgeId: 1
    },
    gameId: {
      gameId: 1
    }
  };

  ngOnInit(): void {
    this.badgeService.getAllBadges();
    this.gameService.getAllSignal();
  }

  addChallenge() {
    console.log('New Challenge Game Data:', this.newChallengeGame);
    this.callParentEvent.emit(this.newChallengeGame);
  }
}

