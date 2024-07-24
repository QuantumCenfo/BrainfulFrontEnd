import { Component, inject, input, Input, SimpleChanges } from "@angular/core";
import { IBadge } from "../../interfaces";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BadgeService } from "../../services/badge.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../modal/modal.component";
import { BadgeFormComponent } from "../badge-form/badge-form.component";
import Swal from "sweetalert2";
import { UserBadgeService } from "../../services/user-badge.service";

@Component({
  selector: "app-badge-list",
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, BadgeFormComponent],
  templateUrl: "./badge-list.component.html",
  styleUrl: "./badge-list.component.scss",
})
export class BadgeListComponent {
  @Input() badgeList: IBadge[] = [];

  private badgeSerivce = inject(BadgeService);

  public modalService = inject(NgbModal);

  @Input() isAllowed: boolean = false;

  public selectedBadge: IBadge = {};
  public selectedFile: File | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isAllowed"]) {
      console.log("isAllowed: ", this.isAllowed);
    }
  }

  showDetailModal(badge: IBadge, modal: any) {
    console.log("Badge: ", badge, "modal: ", modal);
    this.selectedBadge = { ...badge };
    modal.show();
  }
  onFormEventCalled(event: { badge: IBadge; file: File | null }) {
    console.log("PAram", event);
    if (event.file) {
      this.badgeSerivce.updateBadge(event.badge, event.file).subscribe({
        next: (res: any) => {
          const updatedBadge = this.badgeSerivce
            .badgeSignal()
            .map((b) => (b.badgeId === event.badge.badgeId ? event.badge : b));
          this.badgeSerivce.badgeSignal.set(updatedBadge);
          console.log("Response: ", res);

          Swal.fire({
            title: "¡Éxito!",
            text: "La insignia ha sido actualizada",
            icon: "success",
            iconColor: "white",
            color: "white",
            background: "#16c2d5",
            confirmButtonColor: "#ff9f1c",
          });
        },
        error: (err: any) => {
          console.log("Error: ", err);
        },
      });
    } else {
      Swal.fire({
        title: "Oops...",
        text: "Porfavor subir una imagen",
        icon: "warning",
        iconColor: "white",
        color: "white",
        background: "#16c2d5",
        confirmButtonColor: "#ff9f1c",
      });
    }
    this.modalService.dismissAll();
  }

  delteBadge(badgeID: number) {
    this.badgeSerivce.deleteBadge(badgeID);
  }
}
