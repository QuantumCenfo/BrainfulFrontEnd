import { Component, inject, Input, OnInit } from "@angular/core";
import { BadgeListComponent } from "../../components/badge-list/badge-list.component";
import { IBadge } from "../../interfaces";
import { UserBadgeService } from "../../services/user-badge.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { LoaderComponent } from "../../components/loader/loader.component";
import { UserBadgeListComponent } from "../../components/user-badge-list/user-badge-list.component";

@Component({
  selector: "app-badges-users",
  standalone: true,
  imports: [BadgeListComponent, LoaderComponent, UserBadgeListComponent],
  templateUrl: "./badges-users.component.html",
  styleUrl: "./badges-users.component.scss",
})
export class BadgesUsersComponent implements OnInit {
  public userBadgesService = inject(UserBadgeService);
  public isAllowed: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);
  public authService: AuthService = inject(AuthService);
  public routeAuthorites: string[] = [];

  userID: number = this.getUserIdFromLocalStorage() || 0;

  ngOnInit(): void {
    this.userBadgesService.getUserBadges(this.userID);
    this.authService.getUserAuthorities();
    this.route.data.subscribe((data) => {
      this.routeAuthorites = data["authorities"] ? data["authorities"] : [];
      this.isAllowed = this.authService.areActionsAvailable(
        this.routeAuthorites
      );
    });
  }

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    console.log("AuthUser: ", authUser);
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }
}
