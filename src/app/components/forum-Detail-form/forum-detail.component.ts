import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IComment, IForum } from '../../interfaces';
import Swal from 'sweetalert2';

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
  public badWordsDictionary: Set<string> = new Set([
    'puto',
    'puta',
    'mierda',
    'retrazado',
    'bastardo',
    'carepicha',
    'hijo de puta',
    'cretino',
    'zorra',
    'pendeja',
    'cojudo',
    'sinvergüenza',
    'mamarracho',
    'cretinazo',
    'cochino',
    'hooligan',
    'mogollón',
    'pavoso',
    'cabrón',
    'imbécil',
    'gilipollas',
    'malparido',
    'desgraciado',
    'maricón',
    'perra',
    'soplapollas',
    'cagón',
    'putañero',
    'putón',
    'cabrona',
    'putita',
    'necio',
    'idiota',
    'bruto',
    'asqueroso',
    'infeliz',
    'maldito',
    'pajero',
    'culo',
    'pichula',
    'verga',
    'hijo de mil putas',
    'que te den por culo',
    'que te jodan',
    'vete a la mierda',
    'chabacano',
    'chungo',
    'puto perro'
  ]);

  ngOnChanges(): void {
    this.resetForm();
  }

  resetForm(): void {
    if(this.title === "Agregar")
    {
      this.toUpdateComent = {};
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

  transformForum(forum: any): any {
    return {
      forumId: forum.forumId
    };
  }

  addEdit() {
    if(this.toUpdateComent.content)
    {
      if(this.containsBadWords(this.toUpdateComent.content) == false)
      {
        const authUser = localStorage.getItem("auth_user");
        if (authUser) {
          const user = JSON.parse(authUser);
          this.toUpdateComent.user = this.transformUser(user);
          this.toUpdateComent.forum = this.transformForum(this.forum);
          this.callParentEvent.emit(this.toUpdateComent);
          this.resetForm();
        }
      }
      else
      {
        Swal.fire({
          title: "Oops...",
          text: "Este comentario podría contener palabras inapropiadas. Por favor, revisa el contenido antes de proceder.",
          icon: "warning",
          iconColor: "white",
          color: "white",
          background: "#16c2d5",
          timer: 5000,
        });
      }
    }
    else
    {
      Swal.fire({
        title: "Oops...",
        text: "Falta de agregar el contenido del comentario",
        icon: "warning",
        iconColor: "white",
        color: "white",
        background: "#16c2d5",
        timer: 2000,
      });
    }
  }

  containsBadWords(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (this.badWordsDictionary.has(word)) {
        return true;
      }
    }
    return false;
  }

}
