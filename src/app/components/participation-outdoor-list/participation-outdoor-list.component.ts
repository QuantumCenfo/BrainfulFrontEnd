import { Component, inject, Input, OnInit } from "@angular/core";
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
export class ParticipationOutdoorListComponent implements OnInit {
  @Input() participationList: IPartcipationOutdoor[] = [];
  public selectedItem: IPartcipationOutdoor = {};

  dataSource = new MatTableDataSource<IPartcipationOutdoor>([]);
  filteredDataSource = new MatTableDataSource<IPartcipationOutdoor>();
  public currentParticipation: IPartcipationOutdoor = {};
  private participationService = inject(ParticipationOutdoorService);

  public modalService = inject(NgbModal);

  ngOnInit(): void {
    this.dataSource.data = this.participationList;
    this.filterDataSource();
  }

  showDetail(participation: IPartcipationOutdoor, modal: any) {
    this.currentParticipation = { ...participation };
    modal.show();
  }

  pageEvent(event: PageEvent) {
    console.log("Event", event);
  }

  filterDataSource() {
    this.filteredDataSource.data = this.dataSource.data.filter(
      (row: IPartcipationOutdoor) => row.status === "pendiente"
    );
  }
}
