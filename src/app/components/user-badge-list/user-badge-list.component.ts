import { Component, inject, Input } from "@angular/core";
import { IBadge, IUserBadge } from "../../interfaces";
import { UserBadgeService } from "../../services/user-badge.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-user-badge-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./user-badge-list.component.html",
  styleUrl: "../badge-list/badge-list.component.scss",
})
export class UserBadgeListComponent {
  @Input() badgeList: IUserBadge[] = [{}];

  private userBadgeService = inject(UserBadgeService);
}
