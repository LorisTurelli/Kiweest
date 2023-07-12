import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditRecipeComponent } from './kitchen/edit-recipe/edit-recipe.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { ListComponent } from './list/list.component';
import { SettingsComponent } from './settings/settings.component';
import { EditWeekComponent } from './week/edit-week/edit-week.component';
import { WeekComponent } from './week/week.component';

const routes: Routes = [
  {path:'',redirectTo:'/kitchen',pathMatch:'full'},
  {path:"kitchen",component:KitchenComponent},
  {path:"kitchen/editRecipe",component:EditRecipeComponent},
  {path:"kitchen/editRecipe/:id",component:EditRecipeComponent},
  {path:"week",component:WeekComponent},
  {path:"week/editWeek",component:EditWeekComponent},
  {path:"week/editWeek/:id",component:EditWeekComponent},
  {path:"list/:id",component:ListComponent},
  {path:"settings",component:SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
