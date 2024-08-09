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
import { SweetAlertService } from "../../services/sweet-alert-service.service";
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
  private alertService = inject(SweetAlertService);
  public currentOutDoorChallenge: IChallengeOutdoor = {};

  colors = ["#9816D5", "#2f9ca8", "#65b32a", "#FF9F1C"];

  private router: Router = new Router();

  currentOutdoorIndex: number = 0;
  currentGameIndex: number = 0;

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
      this.alertService.showWarning("Por favor suba una imagen");
    }
  }

  goToGames() {
    this.router.navigate(["app/games"]);
  }
}
