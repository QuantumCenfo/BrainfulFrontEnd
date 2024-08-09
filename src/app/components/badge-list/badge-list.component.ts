import { Component, inject, input, Input, SimpleChanges } from "@angular/core";
import { IBadge, IUserBadge } from "../../interfaces";
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
  @Input() isAllowed: boolean = false;
  @Input() userBadge: IUserBadge[] = [];
  flippedIndexes: number[] = []; // Array to track flipped cards

  colors = ["#9816D5", "#2f9ca8", "#65b32a", "#FF9F1C"];

  public selectedBadge: IBadge = {};
  public selectedFile: File | null = null;
  isFlipped: boolean = false;

  private badgeService = inject(BadgeService);
  public modalService = inject(NgbModal);

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
    this.badgeService.handleUpdateBadge(event.badge, event.file!);
    this.modalService.dismissAll();
  }

  delteBadge(badgeID: number) {
    this.badgeService.deleteBadge(badgeID);
  }

  getGradient(index: number): string {
    const color = this.colors[index % this.colors.length];
    return this.generateGradient(color);
  }
  getBoxShadow(index: number): string {
    const color = this.colors[index % this.colors.length];
    return this.generateBoxShadow(color);
  }
  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  generateBoxShadow(color: string): string {
    const darkerColor = this.lightenColor(color, -20); // You can adjust the lightness
    return `2px 0px 0px 3px ${darkerColor}`;
  }

  generateGradient(color: string): string {
    const lightColor = this.lightenColor(color, 30); // You can adjust the lightness
    return `linear-gradient(45deg, ${color} 0%, ${lightColor} 57%, ${color} 100%)`;
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }

  flipCard(index: number) {
    const flippedIndex = this.flippedIndexes.indexOf(index);
    if (flippedIndex >= 0) {
      // Card is already flipped, so unflip it
      this.flippedIndexes.splice(flippedIndex, 1);
    } else {
      // Flip the card
      this.flippedIndexes.push(index);
    }
    console.log("Flipped Indexes: ", this.flippedIndexes);
  }
}
