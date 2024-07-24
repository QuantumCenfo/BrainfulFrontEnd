import { ChallengeGameService } from "./../../services/challenge-game.service";
import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  IBadge,
  IChallengeOutdoor,
  IPartcipationOutdoor,
  IUser,
} from "../../interfaces";
import { Router } from "@angular/router";
import { ChallengeListComponent } from "../challenge-list/challenge-list.component";

@Component({
  selector: "app-outdoor-form",
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: "./outdoor-form.component.html",
  styleUrl: "./outdoor-form.component.scss",
})
export class OutdoorFormComponent {
  @Input() outDoorChallenge: IChallengeOutdoor = {} as IChallengeOutdoor;

  public modalService = inject(NgbModal);
  public challenge = inject(ChallengeListComponent);

  private challengeGameService = inject(ChallengeGameService);

  private router = inject(Router);

  user_id: number | undefined = this.getUserIdFromLocalStorage();

  participation: IPartcipationOutdoor = {};

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }

  @Input() actualFile: File | null = null;

  @Input() btn = "";
  file: File | null = null;

  @Output() callParentEvent = new EventEmitter<{
    participation: IPartcipationOutdoor;
    file: File | null;
  }>();

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["outDoorChallenge"]) {
      this.updateParticipation();
    }
  }

  addParticipation() {
    console.log(this.participation);
    this.callParentEvent.emit({
      participation: this.participation,
      file: this.file,
    });
    this.modalService.dismissAll();
  }

  updateParticipation() {
    this.participation = {
      status: "pendiente",
      fechaPublicacion: new Date().toISOString().split("T")[0],
      user: {id:this.user_id} as IUser,
      challengeOutdoor: {outdoorChallengeId:this.outDoorChallenge
        .outdoorChallengeId} as IChallengeOutdoor,
    };
  }
}