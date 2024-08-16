import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-habit-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './habit-add-modal.component.html',
  styleUrls: ['./habit-add-modal.component.scss']
  
})
export class HabitAddModalComponent {
  habit = {
    habitType: '',
    habitDetails: '',
    habitDate: new Date().toISOString().split('T')[0] 
  };

  constructor(
    public dialogRef: MatDialogRef<HabitAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.habit = data.habit || this.habit;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(this.habit);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
