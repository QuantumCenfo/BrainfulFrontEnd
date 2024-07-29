import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { IBadge } from "../../interfaces";
import { ModalComponent } from "../modal/modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-badge-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./badge-form.component.html",
  styleUrl: "./badge-form.component.scss",
})
export class BadgeFormComponent {
  @Input() badge: IBadge = {
    title: "",
    description: "",
    url: "",
  };
  @Input() actualFile: File | null = null;
  @Input() btn = "";

  file: File | null = null;

  @Output() callParentEvent = new EventEmitter<{
    badge: IBadge;
    file: File | null;
  }>();
  public modalService = inject(NgbModal);

  addEditBadge() {
    this.callParentEvent.emit({ badge: this.badge, file: this.file });
    this.modalService.dismissAll();
  }
  onFileChange(event: any) {
    this.file = event.target.files[0];
  }
}
