import { GameService } from './../../services/game.service';
import { inject, OnInit } from '@angular/core';
import { IChallengeGame, IBadge, IGame } from './../../interfaces/index';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeService } from '../../services/badge.service';
import Swal from 'sweetalert2';

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

  @Input() titleComp: string = 'Añadir Desafío';
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
    if (this.validateForm()) {
      console.log('New Challenge Game Data:', this.newChallengeGame);
      this.callParentEvent.emit(this.newChallengeGame);
    }
  }

  validateForm(): boolean {
    if (
      !this.newChallengeGame.title ||
      !this.newChallengeGame.description ||
      !this.newChallengeGame.objectiveScore &&
      this.newChallengeGame.objectiveScore !== 0 ||
      !this.newChallengeGame.objectiveTime &&
      this.newChallengeGame.objectiveTime !== 0 ||
      !this.newChallengeGame.startDate ||
      !this.newChallengeGame.endDate ||
      !this.newChallengeGame.badgeId?.badgeId ||
      !this.newChallengeGame.gameId?.gameId
    ) {
      this.showAlert('Campos vacíos', 'Por favor, complete todos los campos requeridos.');
      return false;
    }

    if (this.newChallengeGame.objectiveScore < 0 || this.newChallengeGame.objectiveTime < 0) {
      this.showAlert('Números negativos', 'Por favor, introduce valores mayores o iguales a cero en los campos numéricos.');
      return false;
    }

    if (this.isPastDate(this.newChallengeGame.startDate)) {
      this.showAlert('Fecha inválida', 'La fecha de inicio debe ser hoy o una fecha futura.');
      return false;
    }

    if (this.isEndDateInvalid(this.newChallengeGame.startDate, this.newChallengeGame.endDate)) {
      this.showAlert('Fecha inválida', 'La fecha de fin debe ser mayor que la fecha de inicio.');
      return false;
    }

    return true;
  }

  showAlert(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      iconColor: 'white',
      color: 'white',
      background:'#d54f16',
      position: 'center',
      text: text,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    
    // Restar un día para ajustar la diferencia de zonas horarias
    today.setUTCHours(0, 0, 0, 0);
    today.setDate(today.getDate() - 1);
    
    // Crear una nueva instancia de la fecha ingresada con hora en 00:00:00
    const inputDate = new Date(date);
    inputDate.setUTCHours(0, 0, 0, 0);
  
    // Comparar solo por año, mes y día
    return inputDate < today;
  }
  
  isEndDateInvalid(startDate: Date, endDate: Date): boolean {
    if (!startDate || !endDate) return false;
    return endDate <= startDate;
  }
  
}

