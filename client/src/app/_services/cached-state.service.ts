import { Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';
import { MemberService } from './member.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class CachedStateService {
  constructor(
    private recipeService: RecipeService,
    private memberService: MemberService,
    private messageService: MessageService
  ) {}

  clearCachedDataOnLogout() {
    this.recipeService.clearCachedRecipes();
    this.memberService.clearCachedMembers();
    this.messageService.clearCaches();
  }
}
