import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { Observable, catchError, tap, throwError } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { SweetAlertService } from "./sweet-alert-service.service";

interface IHabit {
  habitTrackerId?: number;
  habitType: string;
  habitDate: Date;
  habitDetails: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class HabitService extends BaseService<IHabit> {
  protected override source: string = 'habitTrackers';
  private habitListSignal = signal<IHabit[]>([]);
  
  get habits$() {
    return this.habitListSignal;
  }

  constructor(private sweetAlertService: SweetAlertService) {
    super();
  }

  getAllHabitsSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.habitListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching habits', error);
      },
    });
  }

  addHandleHabit(habit: IHabit) {
    this.add(habit).subscribe({
      next: (res: any) => {
        this.habitListSignal.update(habits => [res, ...habits]);
        this.sweetAlertService.showSuccess('El hábito ha sido creado');
      },
      error: (err: any) => {
        this.sweetAlertService.showError('Hubo un problema al agregar el hábito');
      },
    });
  }

  updateHandleHabit(habit: IHabit) {
    this.add(habit).subscribe({
      next: (res: any) => {
        const updatedHabits = this.habitListSignal().map(h => h.habitTrackerId === habit.habitTrackerId ? res : h);
        this.habitListSignal.set(updatedHabits);
        this.sweetAlertService.showSuccess('El hábito ha sido actualizado');
      },
      error: (err: any) => {
        this.sweetAlertService.showError('Hubo un problema al actualizar el hábito');
      },
    });
  }

  deleteHabit(habitId: number) {
    this.sweetAlertService.showQuestion(
      '¿Está seguro que desea eliminar el hábito?',
      'No podrá recuperar la información'
    ).then((res) => {
      if (res.isConfirmed) {
        this.del(habitId).subscribe({
          next: () => {
            const updatedHabits = this.habitListSignal().filter((h: IHabit) => h.habitTrackerId !== habitId);
            this.habitListSignal.set(updatedHabits);
            this.sweetAlertService.showSuccess('El hábito ha sido eliminado');
          },
          error: (err: any) => {
            this.sweetAlertService.showError('Error al borrar el hábito');
          },
        });
      }
    });
  }
}
