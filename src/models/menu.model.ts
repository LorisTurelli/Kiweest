import { Recipe, ShortRecipe } from "./recipe.model"

export interface Menu{
  name?:string,
  start:Date,
  days:number,
  menu:Day[],
  id?:number|string
}

export interface Day{
  date:Date,
  lunch?:ShortRecipe[],
  dinner?:ShortRecipe[]
}
