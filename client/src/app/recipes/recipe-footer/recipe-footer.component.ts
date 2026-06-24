import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Recipe } from 'src/app/_models/recipe';
@Component({
  selector: 'app-recipe-footer',
  templateUrl: './recipe-footer.component.html',
  styleUrls: ['./recipe-footer.component.css'],
})
export class RecipeFooterComponent implements OnInit {
  @Input() recipe!: Recipe;

  faStar = faStar;

  ngOnInit(): void {}
  constructor() {}

  onPostComment(commentForm: NgForm) {
    console.log(commentForm.controls['comment'].value);
    commentForm.reset();
  }

  
}
