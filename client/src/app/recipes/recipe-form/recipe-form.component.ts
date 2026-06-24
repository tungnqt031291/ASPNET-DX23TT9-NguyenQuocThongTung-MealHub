import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { Recipe } from 'src/app/_models/recipe';
import { AccountService } from 'src/app/_services/account.service';
import { RecipeService } from 'src/app/_services/recipe.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { RecipePayload } from 'src/app/_models/payloads/recipe-payload';
@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
  animations: [
    trigger('fade-out', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '0.3s ease-in-out',
          style({
            opacity: 0,
            transform: 'translateX(12rem)',
          })
        ),
      ]),
    ]),
  ],
})
export class RecipeFormComponent implements OnDestroy {
  id: number = 0;
  recipe!: Recipe;
  editMode: boolean = false;
  faTrash = faTrash;
  recipeForm: FormGroup | undefined;
  recipeIngredients = new FormArray<any>([]);
  submitted = false;
  paramSub!: Subscription;
  recipeSub!: Subscription;

  categories = [
    {
      name: 'Breakfast',
      value: 'Breakfast',
    },
    {
      name: 'Lunch',
      value: 'Lunch',
    },
    {
      name: 'Desert',
      value: 'Desert',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      // Check the route segments to determine if you're in edit mode
      const id = params.get('id');
      if (id) {
        this.id = +id;
        this.editMode = this.route.snapshot.url.some(
          (segment) => segment.path === 'edit'
        );
      }
    });
  }

  ngOnInit(): void {
    if (this.editMode) {
      this.recipeSub = this.recipeService
        .getRecipeByIdToEdit(this.id)
        .subscribe({
          next: (recipe) => {
            this.recipe = recipe;
            this.createAndFillForm();
          },
        });
    } else {
      this.createForm();
    }
  }

  ngOnDestroy(): void {
    this.paramSub.unsubscribe();
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }

  private createAndFillForm() {
    if (this.recipe) {
      if (this.recipe.ingredients) {
        for (let ing of this.recipe.ingredients) {
          const group = new FormGroup({
            name: new FormControl(ing.name, [Validators.required]),
            amount: new FormControl(ing.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/),
            ]),
          });
          this.recipeIngredients.push(group);
        }
      }
      this.createForm(
        this.recipe.name,
        this.recipe.description,
        this.recipe.preparationSteps,
        this.recipe.category.replace(
          this.recipe.category[0],
          this.recipe.category[0].toUpperCase()
        )
      );
    }
  }

  private createForm(
    name: string = '',
    description: string = '',
    preparationSteps: string = '',
    category: string = this.categories[0].value
  ) {
    this.recipeForm = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      description: new FormControl(description, [
        Validators.required,
        Validators.maxLength(5000),
      ]),
      preparation: new FormControl(preparationSteps, [
        Validators.required,
        Validators.maxLength(5000),
      ]),
      ingredients: this.recipeIngredients,

      category: new FormControl(category),
    });
  }

  get controls() {
    // a getter!
    return (<FormArray>this.recipeForm?.get('ingredients')).controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.editMode) {
      const payload = this.createPayLoad('update');
      this.recipeService.updateRecipe(this.id, payload).subscribe({
        next: (_) => {},
      });
    } else {
      const payload = this.createPayLoad('new');
      this.recipeService.addRecipe(payload).subscribe({
        next: (response: Recipe) => {
          this.recipe = response;
        },
      });
    }
  }

  createPayLoad(type: string) {
    var { name, category, preparation, description, ingredients } =
      this.recipeForm?.value;
    var payload: RecipePayload = {
      name: name,
      category: category,
      preparationSteps: preparation,
      description: description,
      ingredients: ingredients,
    };
    if (type === 'update' && this.recipe) {
      // payload.hasLiked = this.recipe.hasLiked;
      // payload.likes = this.recipe.likes;
      // payload.likeCount = this.recipe.likeCount;
      // payload.comments = this.recipe.comments;
      return payload;
    } else {
      var user = this.accountService.getCurrentUser();
      if (user == null) throw Error('Unauthorized');
      // payload.appUserName = user.userName;
      // payload.appUserPhotoUrl = user.photoUrl;
      return payload;
    }
  }

  onAddIngredient() {
    this.recipeIngredients.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onRemoveAllIngredients() {
    (<FormArray>this.recipeForm?.get('ingredients')).clear();
  }

  onDeleteIngredient(idx: number) {
    (<FormArray>this.recipeForm?.get('ingredients')).removeAt(idx);
  }

  navigateAway() {
    this.router.navigate(['recipes']);
  }

  onCancelForm() {
    this.navigateAway();
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.recipeForm?.dirty && !this.submitted) {
      return confirm(
        'You have unsaved changes are you sure you want to leave ?'
      );
    }
    return true;
  }
}
