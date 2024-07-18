import { RecomendationService } from './../../services/recomendation.service';
import { Component, inject, Input } from '@angular/core';
import { IRecomendation } from '../../interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-recomendations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendations-list.component.html',
  styleUrl: './recomendations-list.component.scss'
})
export class RecomendationsListComponent {
  @Input() recomendationList: IRecomendation[] = [];
  public selectedItem: IRecomendation = {};
  private recomendationService = inject(RecomendationService);
  public modalService = inject(NgbModal);

 



  deleteRecomendation(recomendation: IRecomendation) {
    this.recomendationService.delete(recomendation);
  }
}
