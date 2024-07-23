import { ChallengesGamesFormComponent } from './../../components/challenges-games-form/challenges-games-form.component';
import { ChallengeGameService } from './../../services/challenge-game.service';
import { ChallengesGamesListComponent } from './../../components/challenges-games-list/challenges-games-list.component';
import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { IChallengeGame } from "../../interfaces";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "../../components/modal/modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AddButtonComponent } from "../../components/add-button/add-button.component";
import { TryAgainModalComponent } from "../../components/try-again-modal/try-again-modal.component";
import { BadgeService } from '../../services/badge.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [ CommonModule,
    ModalComponent,
    LoaderComponent,
    ChallengesGamesListComponent,
    RouterModule,
    AddButtonComponent,
    ChallengesGamesFormComponent],
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.scss'
})
export class ChallengesComponent implements OnInit {
  public challengeGameService = inject(ChallengeGameService);
  public modalService = inject(NgbModal);
  public badgeService = inject(BadgeService);
  public gameService = inject(GameService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public authSerivce = inject(AuthService);
  public routeAuth: string[] = [];
  public hasPermission: boolean = false;
  @ViewChild("formModal") formModal!: ModalComponent;

  ngOnInit(): void {
    this.badgeService.getAllBadges();
    this.gameService.getAllSignal();
  }

  onFormEventCalled (params: IChallengeGame) {
    console.log('Challenge Game Data to Save:', params);
    this.challengeGameService.save(params);
    this.modalService.dismissAll();
  }

  showModal() {
    this.formModal.show();
  }
}
