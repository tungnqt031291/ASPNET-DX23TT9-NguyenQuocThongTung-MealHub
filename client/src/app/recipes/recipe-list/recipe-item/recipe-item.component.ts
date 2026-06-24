import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/_models/recipe';
import { RecipeService } from 'src/app/_services/recipe.service';
import { Like } from 'src/app/_models/like';
@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Input() index: number = 0;

  timeStamp: string = '';
  date: string = new Date().toISOString();

  ngOnInit(): void {
    // this.calculateTimeStamp();
  }
  constructor(private recipeService: RecipeService) {}



  calculateTimeStamp() {
    var newDateNow = this.date.split('T')[0];
    var newDateItem = new Date(this.recipe.dateAdded)
      .toISOString()
      .split('T')[0];
    // console.log(newDateNow);
    // console.log(newDateItem);
    var dateArray = newDateNow.split('-');
    var dateArrayItem = newDateItem.split('-');
    let years, months, days;
    years = +dateArray[0] - +dateArrayItem[0];
    months = +dateArray[1] - +dateArrayItem[1];
    days = +dateArray[2] - +dateArrayItem[2];
    if (years > 0) {
      if (years === 1) this.timeStamp = `${years} year ago`;
      else this.timeStamp = `${years} years ago`;
    } else if (months > 0) {
      if (months === 1) this.timeStamp = `${months} month ago`;
      else this.timeStamp = `${months} months ago`;
    } else {
      if (days === 0) {
        this.timeStamp = `Today`;
      } else if (days === 1) {
        this.timeStamp = `Yesterday`;
      } else {
        this.timeStamp = `${days} days ago`;
      }
    }
  }

  get memberPhoto() {
    var photo = this.recipe.appUserPhotoUrl;
    if (photo) return photo;
    return './assets/default.png';
  }
}
