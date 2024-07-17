import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { IBadge } from "../../interfaces";

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

  file: File | null = null;

  @Output() callParentEvent = new EventEmitter<{
    badge: IBadge;
    file: File | null;
  }>();

  addEditBadge() {
    this.callParentEvent.emit({ badge: this.badge, file: this.file });
  }
  onFileChange(event: any) {
    this.file = event.target.files[0];
  }
}
