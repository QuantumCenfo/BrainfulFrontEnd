import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  output,
} from "@angular/core";
import {
  IFeedBackMessage,
  IUser,
  IFeedbackStatus,
  IUserRole,
} from "../../../interfaces";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { UserService } from "../../../services/user.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RolService } from "../../../services/rol.service";
import { MatSelect, MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.scss",
})
export class UserFormComponent {
  user_id: number = this.getUserIdFromLocalStorage() || 0;
  @Input() title: string = "";
  @Input() user: IUser = {
    name: "",
    lastname: "",
    email: "",
    image: "",
    password: "brain123",
    role: { id: undefined } as IUserRole,
  };

  public modalService = inject(NgbModal);

  @Output() callParentEvent = new EventEmitter<{
    user: IUser;
    file: File | null;
  }>();

  @Input() imageFile: File | null = null;

  @Input() roles: IUserRole[] = [];

  @Input() action: string = "";
  public userService = inject(UserService);
  public rolService = inject(RolService);
  feedbackMessage: IFeedBackMessage = {
    type: IFeedbackStatus.default,
    message: "",
  };

  get roleId(): number | null {
    return this.user.role?.id || null;
  }

  set roleId(value: number) {
    if (this.user.role) {
      this.user.role.id = value;
    }
  }

  handleAction(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.userService[
        this.action == "add" ? "saveUserSignal" : "updateUserSignal"
      ](this.user).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `User successfully ${
            this.action == "add" ? "added" : "updated"
          }`;
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        },
      });
    }
  }

  handleActionUser(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.userService[
        this.action == "add" ? "saveUserSignal" : "updateUserSignal"
      ](this.user).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `User successfully ${
            this.action == "add" ? "added" : "updated"
          }`;
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        },
      });
    }
  }

  addUser() {
    this.callParentEvent.emit({
      user: this.user,
      file: this.imageFile,
    });
    this.modalService.dismissAll();
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }
}
