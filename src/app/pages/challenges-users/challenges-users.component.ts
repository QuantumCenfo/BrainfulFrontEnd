import { Component, inject } from '@angular/core';
import { ChallengeListComponent } from '../../components/challenge-list/challenge-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ChallengeOutdoorService } from '../../services/challenge-outdoor.service';
import { ChallengeGameService } from '../../services/challenge-game.service';

@Component({
  selector: 'app-challenges-users',
  standalone: true,
  imports: [ChallengeListComponent,LoaderComponent],
  templateUrl: './challenges-users.component.html',
  styleUrl: './challenges-users.component.scss'
})
export class ChallengesUsersComponent {
  public challengeOutDoorService = inject(ChallengeOutdoorService);
  public  challengeGameService = inject(ChallengeGameService);
  ngOnInit(): void {
    this.challengeGameService.getAllActiveChallenges();
    this.challengeOutDoorService.getAllActiveChallenges();
  }
}
