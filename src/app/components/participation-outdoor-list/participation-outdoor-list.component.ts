import { Component, inject, Input } from "@angular/core";
import { IPartcipationOutdoor } from "../../interfaces";
import { ParticipationOutdoorService } from "../../services/participation-outdoor.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "../modal/modal.component";
import { ValidationModalComponent } from "../validation-modal/validation-modal.component";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

@Component({
  selector: "app-participation-outdoor-list",
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ValidationModalComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: "./participation-outdoor-list.component.html",
  styleUrl: "./participation-outdoor-list.component.scss",
})
export class ParticipationOutdoorListComponent {
  @Input() participationList: IPartcipationOutdoor[] = [];
  public selectedItem: IPartcipationOutdoor = {};

  dataSource = new MatTableDataSource<IPartcipationOutdoor>([]);

  public currentParticipation: IPartcipationOutdoor = {};
  private participationService = inject(ParticipationOutdoorService);

  public modalService = inject(NgbModal);
  showDetail(participation: IPartcipationOutdoor, modal: any) {
    this.currentParticipation = { ...participation };
    modal.show();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dataSource.data = this.participationList;
  }
  pageEvent(event: PageEvent) {
    console.log("Event", event);
  }
}
