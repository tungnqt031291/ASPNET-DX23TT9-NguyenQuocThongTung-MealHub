import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Recipe } from '../_models/recipe';
import { Like } from '../_models/like';
import { AccountService } from './account.service';
import { Comment } from '../_models/comment';
import { RecipePayload } from '../_models/payloads/recipe-payload';
import { PaginationResults } from '../_models/pagination';
import { PaginationParams } from '../_models/payloads/pagination-params';
import {
  getPaginatedResults,
  getPaginationRecipesHeaders,
} from './pagination-helper';
import { getHttpOptions } from './http-headers-helper';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipesCache = new Map();

  recipeParams: PaginationParams = new PaginationParams();

  apiUrl = environment.apiUrl;

  recipesChanged = new Subject<Recipe[]>();

  likeAdded = new Subject<{ likeObj: Like; recipeId: number }>();
  likeRemoved = new Subject<{ userName: string; recipeId: number }>();

  commentAdded = new Subject<{ com: Comment; recipeId: number }>();
  commentDeleted = new Subject<{
    userName: string;
    recipeId: number;
    commentId: number;
  }>();

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.likeAdded.subscribe({
      next: (like) => {
        const recipe = this.findRecipe(like.recipeId);
        if (like !== null && recipe) {
          var user = this.accountService.getCurrentUser();
          if (user) {
            recipe.likes.push({ ...like.likeObj, userName: user.userName });
            recipe.likeCount++;
            recipe.hasLiked = true;
          }
        }
      },
    });

    this.likeRemoved.subscribe({
      next: (response) => {
        const recipe = this.findRecipe(response.recipeId);

        if (recipe?.likes && recipe.likeCount) {
          recipe.likes = recipe.likes.filter(
            (l: Like) => l.userName !== response.userName
          );
          recipe.likeCount--;
          recipe.hasLiked = false;
        }
      },
    });

    this.commentAdded.subscribe({
      next: (comment) => {
        const recipe = this.findRecipe(comment.recipeId);

        if (comment !== null && recipe) {
          recipe.comments.push(comment.com);
        }
      },
    });

    this.commentDeleted.subscribe({
      next: (response) => {
        const recipe = this.findRecipe(response.recipeId);
        if (recipe) {
          recipe.comments = recipe.comments.filter(
            (c: Comment) => c.commentId !== response.commentId
          );
        }
      },
    });
  }

  private findRecipe(recipeId: number) {
    const recipes = [...this.recipesCache.values()].reduce(
      (arr, elem) => arr.concat(elem.result),
      []
    );
    const recipe = recipes.find((rec: Recipe) => rec.id === recipeId);
    return recipe;
  }

  getRecipeParams() {
    return this.recipeParams;
  }

  setRecipeParams(recipeParams: PaginationParams) {
    this.recipeParams = recipeParams;
  }

  getRecipes(recipeParams: PaginationParams) {
 
    let params = getPaginationRecipesHeaders(recipeParams);

    return getPaginatedResults<Recipe[]>(
      this.apiUrl + 'recipes/list/',
      params,
      this.http
    ).pipe(
      map((response) => {
        this.recipesCache.set(Object.values(recipeParams).join('-'), response);
        return response;
      })
    );
  }

  //View Recipe
  getRecipeById(id: number) {
    return this.http.get<Recipe>(
      this.apiUrl + 'recipes/' + id,
      getHttpOptions()
    );
  }
  //Edit Recipe
  getRecipeByIdToEdit(id: number) {

    return this.http.get<Recipe>(
      this.apiUrl + 'recipes/' + id + '/edit',
      getHttpOptions()
    );
  }

  addRecipe(recipe: RecipePayload) {
    return this.http
      .post<Recipe>(
        this.apiUrl + 'recipes/save-recipe',
        recipe,
        getHttpOptions()
      )
      .pipe(tap((response) => {}));
  }

  updateRecipe(idx: number, recipe: RecipePayload) {
    return this.http
      .put(this.apiUrl + 'recipes/' + idx, recipe, getHttpOptions())
      .pipe(tap((res) => {}));
  }

  deleteRecipe(id: number) {
    return this.http
      .delete(this.apiUrl + 'recipes/' + id, getHttpOptions())
      .pipe(tap((res) => {}));
  }

  clearCachedRecipes() {
    this.recipesCache = new Map();
  }
}
