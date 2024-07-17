import { Component, inject, Input } from "@angular/core";
import { IBadge } from "../../interfaces";
import { BadgeService } from "../../services/badge.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: "app-badge-list",
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: "./badge-list.component.html",
  styleUrl: "./badge-list.component.scss",
})
export class BadgeListComponent {
  @Input() badgeList: IBadge[] = [];
  @Input() hasPermission: boolean = false;

  private badgeSerivce = inject(BadgeService);
  public modalService = inject(NgbModal);

  public selectedBadge: IBadge = {};
}
