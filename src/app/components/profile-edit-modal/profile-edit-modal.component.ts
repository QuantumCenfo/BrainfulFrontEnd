import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IFeedBackMessage, IFeedbackStatus, IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-profile-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-edit-modal.component.html',
  styleUrl: './profile-edit-modal.component.scss'
})
export class ProfileEditModalComponent {
  @Input() title!: string;
  @Input() user: IUser = {
   
  };

  public modalService = inject(NgbModal)

  get roleName(): string {
    return this.user.role ? this.user.role.name : '';
  }

  set roleName(value: string) {
    if (this.user.role) {
      this.user.role.name = value;
    }
  }

  @Output() callParentEvent = new EventEmitter<{
    user: IUser;
    file: File | null;
  }>();

  @Input() imageFile: File|null=null


  @Input() action: string = 'add'
  service = inject(UserService);
  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};

  handleAction (form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      const userCopy: { [key: string]: any } = { ...this.user };
      delete userCopy['role'];  
      
      this.service[this.action === 'add' ? 'saveUserSignal' : 'updateUserSignal'](userCopy).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `User successfully ${this.action === 'add' ? 'added' : 'updated'}`;
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      });
    }
  }

  constructor() {
    const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    const user = JSON.parse(authUser);
    this.user = (user);
    console.log(this.user);
  }
  }


  handleActionUser (form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.service[ this.action == 'add' ? 'saveUserSignal': 'updateUserSignal'](this.user).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `User successfully ${this.action == 'add' ? 'added': 'updated'}`
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      })
    }
  }
  

  editUser() {
    this.callParentEvent.emit({
      user: this.user, file: this.imageFile
    })
    this.modalService.dismissAll()
  }

  
  onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.imageFile = file;
  }
}

transformUser(user: any): any {
  return {
    id: user.id,
    role: {
      id: user.role.id,
      name: user.role.name,
      description: user.role.description,
      createdAt: user.role.createdAt,
      updatedAt: user.role.updatedAt
    }
  };
}

addEdit()  {
  const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    const user = JSON.parse(authUser);
    this.user = this.transformUser(user);
  }
}
  




}
