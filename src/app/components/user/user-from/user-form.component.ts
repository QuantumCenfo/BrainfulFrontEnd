import { Component, EventEmitter, Input, Output, inject, output } from '@angular/core';
import { IFeedBackMessage, IUser, IFeedbackStatus, IUserRole} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
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


  addUser() {
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

}
