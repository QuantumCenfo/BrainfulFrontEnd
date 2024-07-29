// forums.component.ts
import { Component, effect, inject } from "@angular/core";
import { IForum } from "../../interfaces";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ForumService } from "../../services/forum.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriasFormComponent } from "../../components/forum-form/forum-form.component";

@Component({
  selector: "app-forums",
  standalone: true,
  imports: [
    FormsModule,
    LoaderComponent, 
    CommonModule,
    ModalComponent,
    CategoriasFormComponent
],
  templateUrl: "./forums.component.html",
  styleUrls: ["./forums.component.scss"],
})
export class ForumsComponent {
  isMyForumsView = false;
  selectedDifficulty: string = "";
  onButtonDificultyClick(dificulty: string): void {
    this.selectedDifficulty = dificulty;
    console.log("Selected: ", this.selectedDifficulty);
  }

  public forumList: IForum[] = [];
  private service = inject(ForumService);
  public modalService: NgbModal = inject(NgbModal);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  displayedForums: IForum[] = [];


  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.forumList = this.service.forums$();
      this.updateDisplayedForums();
    });
  }

  updateDisplayedForums(): void {
    this.displayedForums = this.forumList; // Actualiza displayedForums con los datos del servicio
  }

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }

  onMyForumsClick(): void {
    if (this.isMyForumsView) {
      this.loadAllForums();
      this.isMyForumsView = false;
    } else {
      this.loadMyForums();
      this.isMyForumsView = true;
    }
  }

  loadAllForums(): void {
    this.service.getAllSignal();
  }

  loadMyForums(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.service.getMySignal(userId);
    } else {
      console.error("User ID is not available in local storage");
    }
  }

  isForumOwnedByUser(forum: IForum): boolean {
    const userId = this.getUserIdFromLocalStorage();
    return forum.user?.id === userId;
  }

  onDeleteForum(forumId: number): void {
    this.service.deleteForum(forumId);
  }

  onFormEventCalled (params: IForum) {
    this.service.save(params);
    this.modalService.dismissAll();
  }

  viewForumDetail(forum: IForum): void {
    this.router.navigate(['/app/forums-details', forum.forumId])
  }

}
