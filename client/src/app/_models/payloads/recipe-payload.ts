import { Ingredient } from '../ingredient';

export interface RecipePayload {
  name: string;
  category: string;
  preparationSteps: string;
  description: string;
  ingredients: Ingredient[];
}
