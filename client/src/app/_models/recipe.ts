import { Ingredient } from './ingredient';
import { Like } from './like';
import { Comment } from './comment';

export interface Recipe {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  preparationSteps: string;
  category: string;
  dateAdded: string;
  ingredients: Ingredient[];
  likeCount: number;
  hasLiked: boolean;
  likes: Like[];
  comments: Comment[];
  appUserPhotoUrl?: string;
  appUserName?: string;
}
