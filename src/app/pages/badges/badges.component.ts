import { Component } from "@angular/core";
import { IBadge } from "../../interfaces";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-badges",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./badges.component.html",
  styleUrl: "./badges.component.scss",
})
export class BadgesComponent {
  public badges: IBadge[] = [
    {
      badgeId: 1,
      title: "Badge 1",
      description: "Description 1",
      image: "../../../assets/icons/LogoP.png",
    },
    {
      badgeId: 2,
      title: "Badge 2",
      description: "Description 2",
      image: "../../../assets/icons/LogoP.png",
    },
    {
      badgeId: 3,
      title: "Badge 3",
      description: "Description 3",
      image: "../../../assets/icons/LogoP.png",
    },
  ];
}
