import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Like } from '../_models/like';
import { catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RecipeService } from './recipe.service';
import { getHttpOptions } from './http-headers-helper';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  likeRecipe(newRecipe: { username: string; recipeId: number }) {
    return this.http
      .post<Like>(this.apiUrl + 'like', newRecipe, getHttpOptions())
      .pipe(
        tap((like) => {
          // Emit an event to update recipes
          this.recipeService.likeAdded.next({
            likeObj: like,
            recipeId: newRecipe.recipeId,
          });
        })
      );
  }

  unlikeRecipe(likeReq: { userName: string; recipeId: number }) {
    return this.http
      .delete(this.apiUrl + 'like/' + likeReq.recipeId, getHttpOptions())
      .pipe(
        tap((_) => {
          // Emit an event to update recipes
          this.recipeService.likeRemoved.next(likeReq);
        }),
        catchError((error) => {
          console.log('Error unLiking recipe');
          throw error;
        })
      );
  }
}
