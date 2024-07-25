import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IForum } from '../../interfaces';

@Component({
  selector: 'app-forum-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './forum-form.component.html',
  styleUrl: './forum-form.component.scss'
})
export class CategoriasFormComponent {
  @Input() title: string = 'Agregar';
  @Input() toUpdateForum: IForum = {};
  @Output() callParentEvent: EventEmitter<IForum> = new EventEmitter<IForum>();

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
      this.toUpdateForum.user = this.transformUser(user);
    }
    this.callParentEvent.emit(this.toUpdateForum);
  }

}
