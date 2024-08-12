import { Component, OnInit, ViewChild } from '@angular/core';
import { ReminderService } from '../../services/reminder.service';
import { IReminder, IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ReminderFormComponent } from '../../components/reminder/reminder-form/reminder-form.component';
import { ReminderListComponent } from '../../components/reminder/reminder-list/reminder-list.component';
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, ReminderListComponent, ReminderFormComponent, ModalComponent, LoaderComponent],
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {
  todayReminders: IReminder[] = [];
  tomorrowReminders: IReminder[] = [];
  selectedReminder: IReminder = {} as IReminder;
  modalTitle: string = 'Agregar/Editar Recordatorio';

  @ViewChild('reminderModal') reminderModal!: ModalComponent;
  User: IUser = {} as IUser;

  constructor(public reminderService: ReminderService) {}

  ngOnInit(): void {
    this.loadReminders();
  }

  transformUser(user: any): IUser {
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
        createdAt: user.role.createdAt,
        updatedAt: user.role.updatedAt
      }
    };
  }

  loadReminders(): void {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      this.User = this.transformUser(user);
    }
    if (this.User && this.User.id) {
      this.reminderService.getRemindersByUser(this.User.id).subscribe({
        next: (reminders: IReminder[]) => {
  
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          today.setDate(today.getDate() - 1);
  
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
  
          this.todayReminders = reminders.filter(r => {
            const reminderDate = new Date(r.reminderDate);
            return this.isSameDate(reminderDate, today);
          });
  
          this.tomorrowReminders = reminders.filter(r => {
            const reminderDate = new Date(r.reminderDate);
            return reminderDate >= tomorrow;
          });

        },
        error: (error: any) => console.error('Error loading reminders', error)
      });
    }
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    const startOfDay1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const startOfDay2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return startOfDay1.getTime() === startOfDay2.getTime();
  }

  openReminderForm(reminder?: IReminder): void {
    this.selectedReminder = reminder ? { ...reminder } : {} as IReminder;
    this.modalTitle = reminder ? 'Editar Recordatorio' : 'Agregar Recordatorio';
    this.reminderModal.show();
  }

  closeReminderForm(): void {
    this.reminderModal.hide();
    this.selectedReminder = {} as IReminder;
  }

  saveReminder(reminder: IReminder): void {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      this.User = this.transformUser(user);
    }
    reminder.user = this.User;
    if (reminder.reminderId) {
      this.reminderService.updateReminder(reminder.reminderId, reminder).subscribe({
        next: () => {
          this.loadReminders();
          this.closeReminderForm();
        },
        error: (error) => console.error('Error updating reminder', error)
      });
    } else {
      this.reminderService.addReminder(reminder).subscribe({
        next: () => {
          this.loadReminders();
          this.closeReminderForm();
        },
        error: (error) => console.error('Error adding reminder', error)
      });
    }
  }

  deleteReminder(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de eliminar el recordatorio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reminderService.deleteReminder(id).subscribe({
          next: () => {
            this.loadReminders();
            Swal.fire(
              '¡Eliminado!',
              'El recordatorio fue eliminado',
              'success'
            );
          },
          error: (error) => {
            console.error('Error deleting reminder', error);
            Swal.fire(
              'Error!',
              'There was a problem deleting the reminder.',
              'error'
            );
          }
        });
      }
    });
  }

  editReminder(reminder: IReminder): void {
    this.selectedReminder = reminder;
    this.openReminderForm(reminder);
  }
}
