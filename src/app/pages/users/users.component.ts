import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { UserListComponent } from "../../components/user/user-list/user-list.component";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { IUser } from "../../interfaces";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { RolService } from "../../services/rol.service";
import { AddButtonComponent } from "../../components/add-button/add-button.component";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    UserListComponent,
    UserFormComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule,
    AddButtonComponent,
  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent implements OnInit {
  public userService = inject(UserService);
  public rolService = inject(RolService);
  ngOnInit(): void {
    this.userService.getAllSignal();
    this.rolService.getAllSignal();
  }
  @ViewChild("formModal") formModal!: ModalComponent;

  openAddUser() {
    this.formModal.show();
  }

  onFormEventCalled(event: { user: IUser; file: File | null }) {
    this.userService.addHandleUser(event.user, event.file!);
  }
}
