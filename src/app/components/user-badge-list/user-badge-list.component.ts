import { Component, inject, Input } from "@angular/core";
import { IUserBadge } from "../../interfaces";
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

  colors = ["#9816D5", "#2f9ca8", "#65b32a", "#FF9F1C"];
  flippedIndexes: number[] = []; 

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
