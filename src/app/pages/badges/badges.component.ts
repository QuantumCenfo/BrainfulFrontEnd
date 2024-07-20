import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { IBadge } from "../../interfaces";
import { CommonModule } from "@angular/common";
import { BadgeService } from "../../services/badge.service";
import { ModalComponent } from "../../components/modal/modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "../../components/loader/loader.component";
import { BadgeListComponent } from "../../components/badge-list/badge-list.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AddButtonComponent } from "../../components/add-button/add-button.component";
import { BadgeFormComponent } from "../../components/badge-form/badge-form.component";
import { TryAgainModalComponent } from "../../components/try-again-modal/try-again-modal.component";

@Component({
  selector: "app-badges",
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    LoaderComponent,
    BadgeListComponent,
    RouterModule,
    AddButtonComponent,
    BadgeFormComponent,
  ],
  templateUrl: "./badges.component.html",
  styleUrl: "./badges.component.scss",
})
export class BadgesComponent implements OnInit {
  public badgeService = inject(BadgeService);
  public modalService = inject(NgbModal);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public authSerivce = inject(AuthService);
  public routeAuth: string[] = [];
  public hasPermission: boolean = false;
  @ViewChild("formModal") formModal!: ModalComponent;

  ngOnInit(): void {
    this.badgeService.getAllBadges();
  }

  onFormEventCalled(event: { badge: IBadge; file: File | null }) {
    if (event.file) {
      this.badgeService.addBadge(event.badge, event.file).subscribe({
        next: (res: any) => {
          console.log("Response: ", res);
          console.log("Badge added successfully");
        },
        error: (err: any) => {
          console.log("Error: ", err);
        },
      });
    } else {
      console.log("No file selected");
    }
  }

  showModal() {
    this.formModal.show();
  }
}
