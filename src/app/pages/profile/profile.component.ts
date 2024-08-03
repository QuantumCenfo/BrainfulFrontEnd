import { Component, inject, ViewChild } from "@angular/core";
import { ProfileService } from "../../services/profile.service";
import { CommonModule } from "@angular/common";
import { UserListComponent } from "../../components/user/user-list/user-list.component";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { ProfileEditModalComponent } from "../../components/profile-edit-modal/profile-edit-modal.component";
import { IUser } from "../../interfaces";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    UserFormComponent,
    LoaderComponent,
    ModalComponent,
    ProfileEditModalComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  public currentUser: IUser = {};

  public userService = inject(UserService);

  onFormEventCalled(event: { user: IUser; file: File | null }) {
    this.userService.handleUpdateUser(event.user, event.file!);
  }

  @ViewChild("ediModal", { static: false }) Modal!: ModalComponent;

  ediUser() {
    this.Modal.show();
  }

  [x: string]: any;
  public profileService = inject(ProfileService);

  constructor() {
    this.profileService.getUserInfoSignal();
    console.log(this.currentUser);
  }
}
