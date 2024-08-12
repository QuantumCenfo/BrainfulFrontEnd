import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { IContent } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../services/sweet-alert-service.service';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class ContentFormComponent {
  public contentService = inject(ContentService);
  public alertService = inject(SweetAlertService);
  @Input() titleComp: string = 'Añadir Contenido';
  @Output() callParentEvent: EventEmitter<IContent> = new EventEmitter<IContent>();
  @Input() newContent: IContent = {}

  addContent() {
    if (this.validateForm()) {
      console.log('New Content Data:', this.newContent);
      this.callParentEvent.emit(this.newContent);
    }
  }

  ngAfterViewInit(): void {
    this.newContent={
      typeMedia: 'none'
    }
  }

  validateForm(): boolean {
    if (
      !this.newContent.title ||
      !this.newContent.description ||
      !this.newContent.publishDate ||
      !this.newContent.url ||
      !this.newContent.typeMedia 
    ) {
      this.alertService.showError('Campos vacíos', 'Por favor, complete todos los campos requeridos.');
      return false;
    }

    return true;
  }

}
