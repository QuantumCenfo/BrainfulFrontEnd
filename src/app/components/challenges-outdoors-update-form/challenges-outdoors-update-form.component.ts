import { ChallengeOutdoorService } from './../../services/challenge-outdoor.service';
import { IChallengeOutdoor, IBadge } from './../../interfaces/index';
import { Component, EventEmitter, Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-challenges-outdoors-update-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './challenges-outdoors-update-form.component.html',
  styleUrl: './challenges-outdoors-update-form.component.scss'
})
export class ChallengesOutdoorsUpdateFormComponent {

  @Input() titleComp: string = 'Actualizar Fechas';
  @Input() toUpdateDateChallengeOutdoor: IChallengeOutdoor = {
    badgeId:{
      badgeId:1
    }
  };
  @Input() badgeList :IBadge[] = [];
  @Output() callParentEvent: EventEmitter<IChallengeOutdoor> = new EventEmitter<IChallengeOutdoor>();

  addEdit() {
    if (this.validateForm()) {
      console.log('Updated Challenge Game Data:', this.toUpdateDateChallengeOutdoor);
      this.callParentEvent.emit(this.toUpdateDateChallengeOutdoor);
    }
  }

  validateForm(): boolean {
    // Validación de campos en blanco
    if (!this.toUpdateDateChallengeOutdoor.startDate || !this.toUpdateDateChallengeOutdoor.endDate) {
      this.showAlert('Campos vacíos', 'Por favor, complete todas las fechas requeridas.');
      return false;
    }

    const startDateString = this.toUpdateDateChallengeOutdoor.startDate;
    const endDateString = this.toUpdateDateChallengeOutdoor.endDate;

    // Validación de fechas
    if (this.isPastDate(startDateString)) {
      this.showAlert('Fecha inválida', 'La fecha de inicio debe ser hoy o una fecha futura.');
      return false;
    }

    if (this.isEndDateInvalid(startDateString, endDateString)) {
      this.showAlert('Fecha inválida', 'La fecha de fin debe ser mayor que la fecha de inicio.');
      return false;
    }

    return true;
  }

  isPastDate(dateString: string): boolean {
    const today = new Date();
    
    // Restar un día para ajustar la diferencia de zonas horarias
    today.setUTCHours(0, 0, 0, 0);
    today.setDate(today.getDate());
    
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

}
