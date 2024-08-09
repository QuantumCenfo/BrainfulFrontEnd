import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-carousel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./carousel.component.html",
  styleUrl: "./carousel.component.scss",
})
export class CarouselComponent {
  @Input() list: any[] = [];
  @Output() onDetail = new EventEmitter<any>();
  @Input() colors: string[] = ["#9816D5", "#2f9ca8", "#65b32a", "#FF9F1C"];

  @Input() btn: string = "";
  @Input() title: string = "";

  private router: Router = new Router();

  currentIndex: number = 0;

  onNextClick() {
    const next = this.currentIndex + 1;
    this.currentIndex = next === this.list.length ? 0 : next;
  }

  onPrevClick() {
    const prev = this.currentIndex - 1;
    this.currentIndex = prev === -1 ? this.list.length - 1 : prev;
  }
  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getBoxShadow(index: number): string {
    const color = this.getColor(index);
    return this.generateBoxShadow(color);
  }

  generateBoxShadow(color: string): string {
    const darkerColor = this.lightenColor(color, -20);
    return `2px 0px 0px 3px ${darkerColor}`;
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
  goToGames() {
    this.router.navigate(["app/games"]);
  }
}
