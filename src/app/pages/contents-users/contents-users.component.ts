import { ContentListUsersComponent } from './../../components/content-list-users/content-list-users.component';
import { Component, inject } from '@angular/core';
import { ModalComponent } from "../../components/modal/modal.component";
import { AddButtonComponent } from "../../components/add-button/add-button.component";
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../components/loader/loader.component";
import { ContentService } from '../../services/content.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contents-users',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    LoaderComponent,
    ContentListUsersComponent
  ],
  templateUrl: './contents-users.component.html',
  styleUrl: './contents-users.component.scss'
})
export class ContentsUsersComponent {
  public contentService = inject(ContentService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public authSerivce = inject(AuthService);
  public routeAuth: string[] = [];
  public hasPermission: boolean = false;

  ngOnInit(): void {
    this.contentService.getAllContents();
  }
}
