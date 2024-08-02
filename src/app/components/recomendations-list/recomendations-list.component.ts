import { RecomendationService } from "./../../services/recomendation.service";
import { Component, inject, Input } from "@angular/core";
import { IRecomendation } from "../../interfaces";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";

@Component({
  selector: "app-recomendations-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
  ],
  templateUrl: "./recomendations-list.component.html",
  styleUrl: "./recomendations-list.component.scss",
})
export class RecomendationsListComponent {
  @Input() recomendationList: IRecomendation[] = [];
  public selectedItem: IRecomendation = {};
  private recomendationService = inject(RecomendationService);
  public modalService = inject(NgbModal);

  dataSource = new MatTableDataSource<IRecomendation>([]);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dataSource.data = this.recomendationList;
  }

  deleteRecomendation(recomendation: IRecomendation) {
    this.recomendationService.delete(recomendation);
  }
}
