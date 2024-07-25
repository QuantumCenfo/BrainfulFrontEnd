
import { Component, inject, Input } from '@angular/core';
import { IPartcipationOutdoor } from '../../interfaces';
import { ParticipationOutdoorService } from '../../services/participation-outdoor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ValidationModalComponent } from '../validation-modal/validation-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-participation-outdoor-list',
  standalone: true,
  imports: [CommonModule,ModalComponent,ValidationModalComponent,CommonModule,
    FormsModule,],
  templateUrl: './participation-outdoor-list.component.html',
  styleUrl: './participation-outdoor-list.component.scss'
})
export class ParticipationOutdoorListComponent {
  @Input() participationList: IPartcipationOutdoor[] = [];
  public selectedItem: IPartcipationOutdoor = {};

  public currentParticipation: IPartcipationOutdoor = {
  };
  private participationService = inject(ParticipationOutdoorService);

  public modalService = inject(NgbModal);
  showDetail(participation: IPartcipationOutdoor, modal: any) {
    this.currentParticipation = { ...participation };
    modal.show();
  }


}
