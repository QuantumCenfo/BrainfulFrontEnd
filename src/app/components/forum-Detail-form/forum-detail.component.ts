import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IComment, IForum } from '../../interfaces';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './forum-detail.component.html',
  styleUrl: './forum-detail.component.scss'
})
export class CommentDetailComponent {
  @Input() title: string = '';
  @Input() forum: IForum | undefined;
  @Input() toUpdateComent: IComment = {};
  @Output() callParentEvent: EventEmitter<IComment> = new EventEmitter<IComment>();

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

  transformForum(forum: any): any {
    return {
      forumId: forum.forumId
    };
  }

  addEdit() {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      this.toUpdateComent.user = this.transformUser(user);
      this.toUpdateComent.forum = this.transformForum(this.forum);
      this.callParentEvent.emit(this.toUpdateComent);
    }
  }

}
