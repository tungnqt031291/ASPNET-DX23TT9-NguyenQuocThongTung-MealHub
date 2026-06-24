import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Recipe } from 'src/app/_models/recipe';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { CommentService } from 'src/app/_services/comment.service';
@Component({
  selector: 'app-view-comments',
  templateUrl: './view-comments.component.html',
  styleUrls: ['./view-comments.component.css'],
})
export class ViewCommentsComponent implements OnInit {
  modalRef?: BsModalRef;
  @Input() recipe!: Recipe;
  @Input() commentCount: number = 0;
  user: User | null = null;
  faDelete = faTrashAlt;

  constructor(
    private modalService: BsModalService,
    private accountService: AccountService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.user = this.accountService.getCurrentUser();
  }

  onShowComments(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  onDeleteComment(commentId: number) {
    if (this.recipe?.id && this.user)
      this.commentService.deleteComment({
        userName: this.user.userName,
        recipeId: this.recipe?.id,
        commentId: commentId,
      });
  }
}
