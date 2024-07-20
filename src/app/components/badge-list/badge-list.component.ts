import { Component, inject, Input } from "@angular/core";
import { IBadge } from "../../interfaces";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BadgeService } from "../../services/badge.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-badge-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
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
