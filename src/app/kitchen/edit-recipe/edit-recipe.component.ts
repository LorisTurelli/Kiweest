import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Ingredient } from 'src/models/ingredient.model';
import { RecipeService } from 'src/sevices/recipe.service';
import { Recipe } from 'src/models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private recipeSrv: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  recipeId!: string | number;
  tags: string[] = [];
  ingredients: Ingredient[] = [];
  private routeSub!: Subscription;
  recipeForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    servings: new FormControl(null, [Validators.required, Validators.min(1)]),
    notes: new FormControl(null),
  });

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      if (params['id'] != undefined) {
        this.recipeSrv.getRecipe(params['id']).subscribe((res) => {
          this.tags = res.tags;
          this.ingredients = res.ingredients;
          this.recipeId = params['id'];
          this.recipeForm = new FormGroup({
            name: new FormControl(res.name, [Validators.required]),
            servings: new FormControl(res.servings, [
              Validators.required,
              Validators.min(1),
            ]),
            notes: new FormControl(res.notes),
          });
        });
      }
    });
  }

  //Attributi Etichette
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  //Funzioni Etichette
  addChip(event: MatChipInputEvent): void {
    if(!this.tags){
      this.tags=[]
    }

    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }
  removeChip(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  //Funzioni Dialog
  openDialog() {
    const dialogRef = this.dialog.open(DialogIngredientComponent, {
      data: { ingredient: { name: null, amount: null, unit: null } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

          this.ingredients.push({
            name: result.name,
            amount: result.amount,
            unit: result.unit,
          });

      }
    });
  }
  removeIngredient(i: number) {
    this.ingredients.splice(i, 1);
  }
  //HTTP Reqs
  onSubmit() {
    if (this.recipeForm.invalid) {
      return;
    }
    let recipe: Recipe = {
      name: this.recipeForm.value.name,
      servings: this.recipeForm.value.servings,
      tags: this.tags,
      notes: this.recipeForm.value.notes,
      ingredients: this.ingredients,
    };
    this.recipeForm.value.tags = this.tags;
    this.recipeId
      ? this.onEditRecipe(recipe, this.recipeId)
      : this.onAddRecipe(recipe);
  }
  onAddRecipe(recipe: Recipe) {
    this.recipeSrv.addRecipe(recipe);
    this.router.navigate(['kitchen']);
  }
  onEditRecipe(recipe: Recipe, id: string | number) {
    this.recipeSrv.editRecipe(recipe, id);
    this.router.navigate(['kitchen']);
  }
}

//Componente Dialog
@Component({
  selector: 'dialog-ingredient',
  templateUrl: 'dialog-ingredient.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class DialogIngredientComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogIngredientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ingredient
  ) {}
  checkUnit(): boolean {
    if (this.data.unit == 'q.b.') {
      this.data.amount = 1;
      return true;
    } else {
      return false;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
