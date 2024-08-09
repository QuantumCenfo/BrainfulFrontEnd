import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IForum } from '../../interfaces';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../services/sweet-alert-service.service';

@Component({
  selector: 'app-forum-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './forum-form.component.html',
  styleUrls: ['./forum-form.component.scss'] // Corregido 'styleUrl' a 'styleUrls'
})
export class CategoriasFormComponent {
  @Input() title: string = 'Agregar';
  @Input() toUpdateForum: IForum = {};
  @Output() callParentEvent: EventEmitter<IForum> = new EventEmitter<IForum>();
  private alertService = inject(SweetAlertService);
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
    this.toUpdateForum = {};
  }

  transformUser(user: any): any {
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
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
    if((this.toUpdateForum.title) && (this.toUpdateForum.description))
    {
      if((this.containsBadWords(this.toUpdateForum.title) == false) && this.containsBadWords(this.toUpdateForum.description) == false)
      {
        const authUser = localStorage.getItem("auth_user");
        if (authUser) {
          const user = JSON.parse(authUser);
          this.toUpdateForum.user = this.transformUser(user);
        }
        this.callParentEvent.emit(this.toUpdateForum);
        this.resetForm(); // Limpiar después de emitir el evento
      }
      else
      {
        this.alertService.showError(
          "Este foro podría contener palabras inapropiadas. Por favor, revisa el contenido antes de proceder.",
        ); 
       
      }
    }
    else
    {
      this.alertService.showError(
        "Falta de agregar titulo o descripción del foro",
      ); 
     
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
