import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/_models/recipe';
import { AccountService } from 'src/app/_services/account.service';
import { RecipeService } from 'src/app/_services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe: Recipe | null = null;
  @Input() customCardStyle: string = 'width: 80%; margin: auto';
  constructor() {}

  ngOnInit(): void {}
}
