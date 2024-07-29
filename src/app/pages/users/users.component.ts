
import { Component, inject, ViewChild } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserFormComponent } from '../../components/user/user-from/user-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { IUser } from '../../interfaces';
import { UserService } from '../../services/user.service';
import {UserFormAdd} from '../../components/user/user-form-add/user-form-add.component';


import { Component } from "@angular/core";
import { UserListComponent } from "../../components/user/user-list/user-list.component";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";


@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    UserListComponent,
    UserFormComponent,
    LoaderComponent,
    ModalComponent,
    UserFormAdd


  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})

export class UsersComponent {
  @ViewChild('formModal') formModal!: ModalComponent;


  openAddUser() {
    this.formModal.show(); 
  }



  public userService = inject(UserService)

  onFormEventCalled(event: { user: IUser; file: File | null }) {
    this.userService.addHandleUser(event.user, event.file!);
  }

 
}
export class UsersComponent {}

