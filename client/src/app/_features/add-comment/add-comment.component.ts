import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';
import { CommentService } from 'src/app/_services/comment.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent {
  @Input() recipeId: number = -1;

  constructor(
    private accountService: AccountService,
    private commentService: CommentService
  ) {}

  onPostComment(commentForm: NgForm) {
    var comment = commentForm.controls['comment'].value;
    var user = this.accountService.getCurrentUser();
    if (this.recipeId > 0 && user) {
      var newComment = {
        userName: user.userName,
        recipeId: this.recipeId,
        comment: comment,
        dateCommented: new Date().toISOString(),
      };
      this.commentService.postComment(newComment);
    }
    commentForm.reset();
  }
}
