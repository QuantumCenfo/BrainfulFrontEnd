import { ChallengeOutdoorService } from './../../services/challenge-outdoor.service';
import { inject, OnInit } from '@angular/core';
import { IBadge, IChallengeOutdoor } from './../../interfaces/index';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeService } from '../../services/badge.service';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../services/sweet-alert-service.service';

@Component({
  selector: 'app-challenges-outdoors-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './challenges-outdoors-form.component.html',
  styleUrl: './challenges-outdoors-form.component.scss'
})
export class ChallengesOutdoorsFormComponent implements OnInit{
  public badgeService = inject(BadgeService);
  public challengeOutdoorService = inject(ChallengeOutdoorService);
private alertService = inject(SweetAlertService)
  @Input() titleComp: string = 'Añadir Desafío';
  @Input() badgeList: IBadge[] = [];
  @Output() callParentEvent: EventEmitter<IChallengeOutdoor> = new EventEmitter<IChallengeOutdoor>();
  @Input() newChallengeOutdoor: IChallengeOutdoor = {
    badgeId: {
      badgeId: 1
    }
  };

  ngOnInit(): void {
    this.badgeService.getAllBadges();
  }

  addChallengeOudoor() {
    if (this.validateForm()) {
      console.log('New Challenge Outdoor Data:', this.newChallengeOutdoor);
      this.callParentEvent.emit(this.newChallengeOutdoor);
    }
  }

  validateForm(): boolean {
    if (
      !this.newChallengeOutdoor.name ||
      !this.newChallengeOutdoor.description ||
      !this.newChallengeOutdoor.requirement ||
      !this.newChallengeOutdoor.startDate ||
      !this.newChallengeOutdoor.endDate ||
      !this.newChallengeOutdoor.badgeId?.badgeId
    ) {
      this.alertService.showError('Campos vacíos', 'Por favor, complete todos los campos requeridos.');
      return false;
    }

    if (this.isPastDate(this.newChallengeOutdoor.startDate)) {
      this.alertService.showError('Fecha inválida', 'La fecha de inicio debe ser hoy o una fecha futura.');
      return false;
    }

    if (this.isEndDateInvalid(this.newChallengeOutdoor.startDate, this.newChallengeOutdoor.endDate)) {
      this.alertService.showError('Fecha inválida', 'La fecha de fin debe ser mayor que la fecha de inicio.');
      return false;
    }

    return true;
  }



  isPastDate(dateString: string): boolean {
    const today = new Date();
    
    // Restar un día para ajustar la diferencia de zonas horarias
    today.setUTCHours(0, 0, 0, 0);
    today.setDate(today.getDate() - 1);
    
    // Crear una nueva instancia de la fecha ingresada con hora en 00:00:00
    const inputDate = new Date(dateString);
    inputDate.setUTCHours(0, 0, 0, 0);
  
    // Comparar solo por año, mes y día
    return inputDate < today;
  }

  isEndDateInvalid(startDateString: string, endDateString: string): boolean {
      if (!startDateString || !endDateString) return false;

      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      return endDate <= startDate;
  }
}
