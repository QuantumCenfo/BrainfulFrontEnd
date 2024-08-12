import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { IReminder } from '../../../interfaces/index';

@Component({
  selector: 'app-reminder-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent {
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
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres guardar el recordatorio?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, Guardar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.save.emit(this.reminder);
          Swal.fire(
            '¡Guardado!',
            'Tu recordatorio fue guardado.',
            'success'
          );
        }
      });
    } else {
      Swal.fire(
        'Error!',
        'Please fill in all required fields.',
        'error'
      );
    }
  }

}
