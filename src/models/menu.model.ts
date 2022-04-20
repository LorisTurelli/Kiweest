import { Recipe } from "./recipe.model"

export interface Menu{
  name?:string,
  start:Date,
  days:number,
  end:Date,
  menu:Day[]
}

export interface Day{
  date:Date,
  lunch?:Recipe[],
  dinner?:Recipe[]
}
