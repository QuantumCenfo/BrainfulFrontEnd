import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { IReminder } from '../../../interfaces/index';
import { SweetAlertService } from '../../../services/sweet-alert-service.service';

@Component({
  selector: 'app-reminder-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent {
  public alertService = inject(SweetAlertService);
  @Input() reminder!: IReminder;
  @Input() toUpdateForum: IReminder = {
    reminderDate: '',
    reminderDetails: '',
    user: {} 
  };
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<IReminder>();

  onSubmit(): void {
    if (this.reminder.name && this.reminder.reminderDate && this.reminder.reminderDetails) {
      // Confirm save action
      this.alertService.showQuestion(
        '¿Estás seguro?',
        "¿Quieres guardar el recordatorio?",
      ).then((result) => {
        if (result.isConfirmed) {
          this.save.emit(this.reminder);
          this.alertService.showSuccess('Tu recordatorio fue guardado.');
        }
      });
    } else {
      this.alertService.showError('Hubo un problema guardando tu recordatorio.');
    }
  }

}
