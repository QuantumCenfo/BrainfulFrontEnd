import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
  IChallengeGame,
  IChallengeOutdoor,
  IPartcipationOutdoor,
} from "../../interfaces";
import { ChallengeGameService } from "../../services/challenge-game.service";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChallengeOutdoorService } from "../../services/challenge-outdoor.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../modal/modal.component";
import { OutdoorFormComponent } from "../outdoor-form/outdoor-form.component";
import Swal from "sweetalert2";
import { ParticipationOutdoorService } from "../../services/participation-outdoor.service";
import { Router } from "@angular/router";
import { CarouselComponent } from "../carousel/carousel.component";

@Component({
  selector: "app-challenge-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ModalComponent,
    OutdoorFormComponent,
    CarouselComponent,
  ],
  templateUrl: "./challenge-list.component.html",
  styleUrl: "./challenge-list.component.scss",
})
export class ChallengeListComponent {
  @Input() outdoorChallengeList: IChallengeOutdoor[] = [];
  @Input() gameChallengeList: IChallengeGame[] = [];

  private participationServices = inject(ParticipationOutdoorService);
  private outDoorChallenge = inject(ChallengeOutdoorService);
  private gameChallengService = inject(ChallengeGameService);
  public currentOutDoorChallenge: IChallengeOutdoor = {};

  colors = ["#9816D5", "#2f9ca8", "#65b32a", "#FF9F1C"];

  private router: Router = new Router();

  currentOutdoorIndex: number = 0;
  currentGameIndex: number = 0;

  onNextOutdoorChallenge() {
    const next = this.currentOutdoorIndex + 1;
    this.currentOutdoorIndex =
      next === this.outdoorChallengeList.length ? 0 : next;
  }

  onPrevOutdoorChallenge() {
    const prev = this.currentOutdoorIndex - 1;
    this.currentOutdoorIndex =
      prev === -1 ? this.outdoorChallengeList.length - 1 : prev;
  }

  onNextGameChallenge() {
    const next = this.currentGameIndex + 1;
    this.currentGameIndex = next === this.gameChallengeList.length ? 0 : next;
  }
  onPrevGameChallenge() {
    const prev = this.currentGameIndex - 1;
    this.currentGameIndex =
      prev === -1 ? this.gameChallengeList.length - 1 : prev;
  }

  showDetail(challengeOutdoor: IChallengeOutdoor, modal: any) {
    this.currentOutDoorChallenge = { ...challengeOutdoor };
    modal.show();
    console.log(challengeOutdoor);
  }
  onFormEventCalled(event: {
    participation: IPartcipationOutdoor;
    file: File | null;
  }) {
    if (event.file) {
      this.participationServices
        .addParticipation(event.participation, event.file)
        .subscribe({
          next: (res: any) => {
            this.participationServices.participationOutdoorSignal.update(
              (participations: any) => [res, ...participations]
            );
          },
          error: (err: any) => {
            console.log("Error: ", err);
          },
        });
    } else {
      Swal.fire({
        title: "Oops...",
        text: "Porfavor suba una imagen",
        icon: "warning",
        iconColor: "white",
        color: "white",
        background: "#16c2d5",
        confirmButtonColor: "#ff9f1c",
      });
    }
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
  goToGames() {
    this.router.navigate(["app/games"]);
  }
}
