import { Component, inject } from '@angular/core';
import { ParticipationOutdoorListComponent } from '../../components/participation-outdoor-list/participation-outdoor-list.component';
import { ParticipationOutdoorService } from '../../services/participation-outdoor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../../components/loader/loader.component';


@Component({
  selector: 'app-participations',
  standalone: true,
  imports: [ParticipationOutdoorListComponent,LoaderComponent],
  templateUrl: './participations.component.html',
  styleUrl: './participations.component.scss'
})
export class ParticipationsComponent {
  public participationsService: ParticipationOutdoorService = inject(ParticipationOutdoorService);

  ngOnInit(): void {
    
    this.participationsService.getAllParticipations();
    
  }
}
