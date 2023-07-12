import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'src/models/recipe.model';
import { map } from 'rxjs/operators';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient,private MenuSrv:MenuService) {}
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
  deleteRecipe(paramId:number|string){
    //this.http.delete('https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/recipes/'+paramId+'.json').subscribe()
    this.MenuSrv.getAllMenus().subscribe(res=>{
      let menus=res
      menus.forEach(menu=>{
        let menuId=menu.id?menu.id:0;
        (menu.menu).forEach((meal,i)=>{
          (meal.dinner)?.forEach((recipe,a)=>{
            if(recipe.id===paramId){
              this.http.delete('https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/menus/'+menuId+'/menu/'+i+'/dinner/'+a+'.json').subscribe()
            }
          });
          (meal.lunch)?.forEach((recipe,a)=>{
            if(recipe.id===paramId){
              this.http.delete('https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/menus/'+menuId+'/menu/'+i+'/lunch/'+a+'.json').subscribe()
            }
          });
        })
      })
    })
  }
}
