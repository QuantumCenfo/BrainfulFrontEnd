import { ChallengesOutdoorsUpdateFormComponent } from './../challenges-outdoors-update-form/challenges-outdoors-update-form.component';
import { ChallengesOutdoorsFormComponent } from './../challenges-outdoors-form/challenges-outdoors-form.component';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { IChallengeOutdoor } from '../../interfaces';
import { ChallengeOutdoorService } from './../../services/challenge-outdoor.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { AddButtonComponent } from "../add-button/add-button.component";
import { BadgeService } from '../../services/badge.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-challenges-outdoors-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, ModalComponent, ChallengesOutdoorsUpdateFormComponent, AddButtonComponent, ChallengesOutdoorsFormComponent, ChallengesOutdoorsFormComponent],
  templateUrl: './challenges-outdoors-list.component.html',
  styleUrl: './challenges-outdoors-list.component.scss'
})
export class ChallengeOutdoorsListComponent {
  @Input() activeChallengeOutdoorList: IChallengeOutdoor[] = [];
  @Input() inactiveChallengeOutdoorList: IChallengeOutdoor[] = [];
  public selectedChallengeOutdoor: IChallengeOutdoor = {};
  public challengeOutdoorService = inject(ChallengeOutdoorService);
  public modalService = inject(NgbModal);
  public badgeService = inject(BadgeService);
  public gameService = inject(GameService);
  @ViewChild("formModalUpdate") formModalUpdate!: ModalComponent;
  @ViewChild("formModal") formModal!: ModalComponent;
  ngOnInit(): void {
    this.badgeService.getAllBadges();
    this.gameService.getAllSignal();
    this.challengeOutdoorService.getAllChallengesByStatus('active');
    this.challengeOutdoorService.getAllChallengesByStatus('inactive');
  }

  showModalUpdate(item: IChallengeOutdoor) {
    this.selectedChallengeOutdoor = {...item};
    this.formModalUpdate.show();
  }

  onFormUpdateEventCalled (params: IChallengeOutdoor) {
    console.log('Challenge Game Data to Save:', params);
    this.challengeOutdoorService.updateDateChallengeOutdoor(params);
    this.modalService.dismissAll();
  }
  
  onFormEventCalled (params: IChallengeOutdoor) {
    console.log('Challenge Game Data to Save:', params);
    this.challengeOutdoorService.save(params);
    this.modalService.dismissAll();
  }

  showModal() {
    this.formModal.show();
  }
}

