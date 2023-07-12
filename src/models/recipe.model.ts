import { Ingredient } from "./ingredient.model";

export interface Recipe{
  name:string,
  servings:number,
  tags:string[],
  notes:string,
  ingredients:Ingredient[],
  id?:number|string
}
export interface ShortRecipe{
  name:string,
  id:number|string
}
