import { ContentListComponent } from './../../components/content-list/content-list.component';
import { Component, inject } from '@angular/core';
import { ModalComponent } from "../../components/modal/modal.component";
import { AddButtonComponent } from "../../components/add-button/add-button.component";
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../components/loader/loader.component";
import { ContentService } from '../../services/content.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contents',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    LoaderComponent,
    ContentListComponent
  ],
  templateUrl: './contents.component.html',
  styleUrl: './contents.component.scss'
})
export class ContentsComponent {
  public contentService = inject(ContentService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public authSerivce = inject(AuthService);
  public routeAuth: string[] = [];
  public hasPermission: boolean = false;

  ngOnInit(): void {
    this.contentService.getAllContents();
  }

  /*showModal() {
    this.formModal.show();
  }*/

}
