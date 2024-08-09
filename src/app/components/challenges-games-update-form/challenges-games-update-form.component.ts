import { IChallengeGame, IBadge, IGame } from './../../interfaces/index';
import { ChallengeGameService } from '../../services/challenge-game.service';
import { Component, EventEmitter, inject, Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../services/sweet-alert-service.service';

@Component({
  selector: 'app-challenges-games-update-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './challenges-games-update-form.component.html',
  styleUrl: './challenges-games-update-form.component.scss'
})
export class ChallengesGamesUpdateFormComponent {
  private alertService = inject(SweetAlertService)
  @Input() titleComp: string = 'Actualizar Fechas';
  @Input() toUpdateDateChallengeGame: IChallengeGame = {
    badgeId:{
      badgeId:1
    },
    gameId:{
      gameId:1
    }
  };
  @Input() badgeList :IBadge[] = [];
  @Input() gameList :IGame[] = [];
  @Output() callParentEvent: EventEmitter<IChallengeGame> = new EventEmitter<IChallengeGame>();

  addEdit() {
    if (this.validateForm()) {
      console.log('Updated Challenge Game Data:', this.toUpdateDateChallengeGame);
      this.callParentEvent.emit(this.toUpdateDateChallengeGame);
    }
  }

  validateForm(): boolean {
    // Validación de campos en blanco
    if (!this.toUpdateDateChallengeGame.startDate || !this.toUpdateDateChallengeGame.endDate) {
      this.alertService.showError('Campos vacíos', 'Por favor, complete todas las fechas requeridas.');
      return false;
    }

    const startDate = new Date(this.toUpdateDateChallengeGame.startDate);
    const endDate = new Date(this.toUpdateDateChallengeGame.endDate);

    // Validación de fechas
    if (this.isPastDate(startDate)) {
      this.alertService.showError('Fecha inválida', 'La fecha de inicio debe ser hoy o una fecha futura.');
      return false;
    }

    if (this.isEndDateInvalid(startDate, endDate)) {
      this.alertService.showError('Fecha inválida', 'La fecha de fin debe ser mayor que la fecha de inicio.');
      return false;
    }

    return true;
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today.setDate(today.getDate()); // Ajuste para zonas horarias

    const inputDate = new Date(date);
    inputDate.setUTCHours(0, 0, 0, 0);

    return inputDate < today;
  }

  isEndDateInvalid(startDate: Date, endDate: Date): boolean {
    if (!startDate || !endDate) return false;
    return endDate <= startDate;
  }



  
}