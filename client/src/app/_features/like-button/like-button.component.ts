import { Component, Input } from '@angular/core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Recipe } from 'src/app/_models/recipe';
import { AccountService } from 'src/app/_services/account.service';
import { LikeService } from 'src/app/_services/like.service';
@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css'],
})
export class LikeButtonComponent {
  @Input() recipe!: Recipe;
  faHeart = faHeart;

  constructor(
    private accountService: AccountService,
    private likeService: LikeService
  ) {}

  onHeartClick() {
    this.recipe.hasLiked = !this.recipe.hasLiked;
    if (this.recipe.hasLiked) {
      this.onLikeRecipe();
    } else {
      this.onUnlikeRecipe();
    }
  }

  onLikeRecipe() {
    if (this.recipe && this.recipe.id) {
      var user = this.validateUser();

      this.likeService
        .likeRecipe({ username: user.userName, recipeId: this.recipe.id })
        .subscribe({
          next: (like) => {
            console.log(like);
            this.recipe.likes.push(like);
          },
        });
    }
  }

  onUnlikeRecipe() {
    if (this.recipe && this.recipe.id) {
      var user = this.validateUser();
      this.likeService
        .unlikeRecipe({
          userName: user.userName,
          recipeId: this.recipe.id,
        })
        .subscribe({
          next: (_) => {},
        });
    }
  }

  validateUser() {
    var user = this.accountService.getCurrentUser();
    if (user === null) throw Error('Unknown user detected!');
    return user;
  }
}
