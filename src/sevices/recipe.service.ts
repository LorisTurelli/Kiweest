import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'src/models/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}
  loadedRecepies: Recipe[]=[];
  getAllRecepies() {
    return this.http
      .get<Recipe[]>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      ).pipe(
        map((response) => {
          const recipes: Recipe[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              recipes.push({ ...response[key], id: key });
            }
          }
          return recipes
        })
      )
  }
  getRecipe(id:string){
    return this.http
      .get<Recipe>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/recipes/'+id+'.json'
      ).pipe(
        map((response) => {
          let recipe: Recipe =response;
          recipe.id=id
          return recipe
        })
      )
  }
  addRecipe(recipe: Recipe) {
    console.log(recipe);
    this.http
      .post<Recipe>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipe
      )
      .subscribe();
  }
  editRecipe(recipe: Recipe,id:string|number){
    this.http
      .put<Recipe>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/recipes/'+id+'.json',
        recipe
      )
      .subscribe();
  }
  deleteRecipe(id:number|string){
    console.log('elimino' + id)
    this.http.delete('https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/recipes/'+id+'.json').subscribe()
  }
}
