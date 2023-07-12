import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/sevices/menu.service';
import { RecipeService } from 'src/sevices/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, concatMap, defer,from } from 'rxjs';
import { Ingredient } from 'src/models/ingredient.model';
import { Day } from 'src/models/menu.model';
import { Recipe } from 'src/models/recipe.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  private routeSub!: Subscription;
  constructor(
    private menuSrv: MenuService,
    private recipeSrv: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  recipesId: Array<string> = [];
  compiledList: Ingredient[] = [];

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.menuSrv.getMenu(params['id']).subscribe((res) => {
        this.recipesId = getRecipesIds(res.menu);
        function getRecipesIds(menu: Day[]) {
          let output: Array<string> = [];
          (function checkRecursive(obj: Array<any>) {
            Object.keys(obj).forEach((prop: string) => {
              if (typeof obj[prop as any] == 'object' && prop !== null) {
                checkRecursive(obj[prop as any]);
              } else if (prop == 'id') {
                output.push(obj[prop as any]);
              }
            });
          })(menu);
          return output;
        }
        let list: Ingredient[] = [];
        from(this.recipesId).pipe(
          concatMap((id)=>
            defer(()=>{
              return this.recipeSrv.getRecipe(id)
            }))
        ).subscribe((res:Recipe)=>{
          let menuIngredients: Ingredient[] = [];
          res.ingredients.forEach((el) => {
            menuIngredients.push(el);
          });
          menuIngredients.forEach((obj) => {
            const e = list.find(
              (e) =>
                e.name.toLowerCase() === obj.name.toLowerCase() &&
                e.unit === obj.unit
            );
            if (e) {
              e.amount += obj.amount;
            } else {
              list.push(obj);
            }
          });
        })
        console.log('list',list);
      });
    });
  }
}
