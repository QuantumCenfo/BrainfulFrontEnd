import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecomendationService } from './../../services/recomendation.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecomendationsListComponent } from '../../components/recomendations-list/recomendations-list.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-recomendations',
  standalone: true,
  imports: [RecomendationsListComponent,ModalComponent,LoaderComponent],
  templateUrl: './recomendations.component.html',
  styleUrl: './recomendations.component.scss'
})
export class RecomendationsComponent {
  public recomendationService: RecomendationService = inject(RecomendationService);
  public modalService: NgbModal = inject(NgbModal);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];
  public areActionsAvailable: boolean = false;
  ngOnInit(): void {
    
    this.recomendationService.getAll();
    
  }

}
