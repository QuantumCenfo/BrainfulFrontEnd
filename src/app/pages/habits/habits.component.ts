import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../services/habit.service';
import { HabitAddModalComponent } from '../../components/habit-add-modal/habit-add-modal.component';
import { MatDialog } from '@angular/material/dialog';

interface IHabit {
  habitTrackerId?: number;
  habitType: string;
  habitDate: Date;
  habitDetails: string;
  userId: number;
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.scss']
})
export class HabitsComponent implements OnInit {
  expandedHabits: {[key: number]: boolean} = {};

  constructor(
    public habitService: HabitService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadHabits();
  }

  loadHabits() {
    this.habitService.getAllHabitsSignal();
  }

  openAddHabitModal(habit?: IHabit) {
    const dialogRef = this.dialog.open(HabitAddModalComponent, {
      width: '400px',
      data: habit 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.habitTrackerId) {
          this.habitService.updateHandleHabit(result);
        } else {
          this.habitService.addHandleHabit(result);
        }
      }
    });
  }

  isExpanded(habit: IHabit): boolean {
    return !!this.expandedHabits[habit.habitTrackerId!];
  }

  expandHabit(habit: IHabit) {
    if (habit.habitTrackerId) {
      this.expandedHabits[habit.habitTrackerId] = true;
    }
  }

  collapseHabit(habit: IHabit) {
    if (habit.habitTrackerId) {
      this.expandedHabits[habit.habitTrackerId] = false;
    }
  }

  deleteHabit(habit: IHabit) {
    if (habit.habitTrackerId) {
      this.habitService.deleteHabit(habit.habitTrackerId);
    }
  }

  addHabit() {
    this.openAddHabitModal();
  }
}
