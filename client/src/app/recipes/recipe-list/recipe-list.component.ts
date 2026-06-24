import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../_services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Recipe } from 'src/app/_models/recipe';
import { Pagination } from 'src/app/_models/pagination';
import { PaginationParams } from 'src/app/_models/payloads/pagination-params';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] | undefined;
  pagination: Pagination | undefined;
  subscription!: Subscription;
  filterCategory: string = 'breakfast';
  recipeParams: PaginationParams | undefined;
  categories: any[] = [
    { value: 'all', display: 'All' },
    { value: 'breakfast', display: 'Breakfast' },
    { value: 'lunch', display: 'Lunch' },
    { value: 'desert', display: 'Desert' },
  ];

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.recipeParams = this.recipeService.getRecipeParams();
    this.filterCategory = this.recipeParams.category;
  }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes() {
    if (!this.recipeParams) return;
    this.recipeService.getRecipes(this.recipeParams).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.recipes = [...(this.recipes || []), ...response.result];
          // this.recipes = response.result;
          this.pagination = response.pagination;
        }
      },
    });
  }

  onScroll() {
    if (this.pagination && this.recipeParams) {
      if (this.recipeParams?.allItemsLoaded(this.pagination.totalItems)) {
        return;
      }
      this.recipeParams?.incrementOffset();
      this.recipeService.setRecipeParams(this.recipeParams);
      this.loadRecipes();
    }
  }

  onCategoryChange(event: any) {
    this.filterCategory = event?.target.value;
    if (
      this.filterCategory.toLowerCase().trim() != 'new' &&
      this.recipeParams
    ) {
      this.recipeParams?.setCategory(this.filterCategory.toLowerCase().trim());
      this.recipeParams?.setOffset(0);
      this.recipeService.setRecipeParams(this.recipeParams);
      this.recipes = [];
      this.loadRecipes();
    }
  }

  ngOnDestroy(): void {
    this.recipeParams?.setOffset(0);
  }

  navigateToNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
