import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IReminder } from '../../../interfaces/index';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reminder-list',
  standalone: true,
  imports: [CommonModule, ReminderListComponent],
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss']
})
export class ReminderListComponent {
  @Input() reminder!: IReminder;
  @Output() edit = new EventEmitter<IReminder>();
  @Output() delete = new EventEmitter<number>();

  onEdit(): void {
    this.edit.emit(this.reminder);
  }

  onDelete(): void {
    this.delete.emit(this.reminder.reminderId);
  }
}
