import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Recipe } from 'src/app/_models/recipe';

@Component({
  selector: 'app-user-recipe-card',
  templateUrl: './user-recipe-card.component.html',
  styleUrls: ['./user-recipe-card.component.css'],
})
export class UserRecipeCardComponent implements OnInit {
  @Input() recipes!: Recipe[];
  ngOnInit(): void {
    // console.log(this.recipes[0].imageUrl);
  }
}
