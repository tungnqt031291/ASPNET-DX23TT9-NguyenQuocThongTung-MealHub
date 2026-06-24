import { Component, Input } from '@angular/core';
import { faDotCircle, faTag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-header',
  templateUrl: './recipe-header.component.html',
  styleUrls: ['./recipe-header.component.css'],
})
export class RecipeHeaderComponent {
  @Input() memberPhoto = '';
  @Input() username = '';
  @Input() timeStamp = '';
  @Input() category = '';
  faDot = faDotCircle;
  faTag = faTag;
}
