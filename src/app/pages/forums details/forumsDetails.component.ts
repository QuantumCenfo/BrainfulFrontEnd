import { Component, effect, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IComment, IForum } from '../../interfaces';
import { ForumService } from "../../services/forum.service";
import { CommentService } from "../../services/comment.service";
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../components/modal/modal.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentDetailComponent } from "../../components/forum-Detail-form/forum-detail.component";

@Component({
  selector: 'app-forumsDetails',
  standalone: true,
  imports: [CommonModule, ModalComponent, CommentDetailComponent],
  templateUrl: './forumsDetails.component.html',
  styleUrls: ['./forumsDetails.component.scss']
})
export class ForumsDetailsComponent {
  public commentsList: IComment[] = [];
  public forumList: IForum[] = [];
  public forum: IForum | undefined;
  public selectedComment: IComment = {};
  private service = inject(ForumService);
  private Commentservice = inject(CommentService);
  private route = inject(ActivatedRoute);
  public modalService: NgbModal = inject(NgbModal);
  displayedComments: IComment[] = [];

  @ViewChild('formModalUpdate', { static: false }) formModalUpdate!: ModalComponent;

  constructor() {
    const forumId = this.route.snapshot.paramMap.get('id');
    if (forumId) {
      this.service.getAllSignal();
      this.Commentservice.getCommentsSignal(forumId);
    }
    effect(() => {
      this.forumList = this.service.forums$();
      this.commentsList = this.Commentservice.comments$();
      if (forumId) {
        this.setForum(parseInt(forumId)); // Llama al método para establecer el foro
      }
      this.updateDisplayedForums();
    });
  }

  updateDisplayedForums(): void {
    this.displayedComments = this.commentsList; // Actualiza displayedForums con los datos del servicio
  }


  private setForum(forumId: number | undefined): void {
    this.forum = this.forumList.find(forum => forum.forumId === forumId);
  }

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }

  isForumOwnedByUser(forum: IComment): boolean {
    const userId = this.getUserIdFromLocalStorage();
    return forum.user?.id === userId;
  }

  onFormEventCalled(params: IComment) {
    this.Commentservice.save(params);
    this.modalService.dismissAll();
  }

  openUpdateModal(comment: IComment) {
    this.selectedComment = comment;
    if (this.formModalUpdate) {
      this.formModalUpdate.show();
    }
  }

  onFormEventCalledUpdate(params: IComment) {
    this.Commentservice.update(params);
    this.modalService.dismissAll();
  }

  onDeleteForum(forumId: number): void {
    this.Commentservice.delete(forumId);
  }
}
 