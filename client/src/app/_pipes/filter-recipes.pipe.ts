import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../_models/recipe';

@Pipe({
  name: 'filterRecipes',
})
export class FilterRecipesPipe implements PipeTransform {
  transform(value: Recipe[] | null = null, category: string): any {
    if (category.toLowerCase() === 'all') return value;
    if (!value) return value;
    return value.filter(
      (rec) => rec.category.toLowerCase() === category.toLowerCase()
    );
  }
}
