import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IPartcipationOutdoor } from '../../interfaces';

@Component({
  selector: 'app-validation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss']
})
export class ValidationModalComponent {
  @Input() title!: string;
  @Input() participation: IPartcipationOutdoor = {};
  public modalService = inject(NgbModal);

  isImageEnlarged = false;

  toggleImageSize(): void {
    this.isImageEnlarged = !this.isImageEnlarged;
  }
}
