import { Component, effect, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../user-from/user-form.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    UserFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public search: String = '';
  public userList: IUser[] = [];
  private service = inject(UserService);
  private snackBar = inject(MatSnackBar);
  public currentUser: IUser = {
    authorities: [],
    birthDate: "",
    createdAt: "",
    email: "",
    id: 0,
    image: "",
    lastname: "",
    name: "",
    password: "",
    role: {name: ''},
    updatedAt: "",
  };
  
  public selectedImg: File|null=null


  public userService = inject(UserService)

  onFormEventCalled(event: { user: IUser; file: File | null }) {
    this.userService.handleUpdateUser(event.user, event.file!);
  }


  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.userList = this.service.users$();
    });
  }

  showDetail(user: IUser, modal: any) {
    this.currentUser = {...user}; 
    console.log(user)
    modal.show();
  }

  deleteUser(user: IUser) {
    this.service.deleteUserSignal(user).subscribe({
      next: () => {
        this.snackBar.open('User deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting user', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

}
