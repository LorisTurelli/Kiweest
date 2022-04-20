import { Component, OnInit,Inject } from '@angular/core';
import { Recipe } from 'src/models/recipe.model';
import { RecipeService } from 'src/sevices/recipe.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {
  constructor(private recipeSrv:RecipeService,public dialog: MatDialog) { }

  displayedColumns: string[] = ['name'];
  dataSource!:MatTableDataSource<Recipe>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.getAllRecipes()
  }

  getAllRecipes() {
    this.recipeSrv.getAllRecepies().subscribe(recipes=>{
      this.dataSource = new MatTableDataSource(recipes);
    });
  }

  //Funzioni Dialog
  deleteRecipe(recipeId?:string|number) {
    const dialogRef = this.dialog.open(DialogConfermaRimuovi, {
      data: {id:recipeId},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllRecipes()
    });
  }
}
//Componente Dialog
@Component({
  selector: 'dialog-ingredient',
  template: `<h3>Sicuro?</h3>
    <p>Se elimini questa ricetta, non potrai più utilizzarla e verrà rimossa dai tuoi Menù.</p>
    <button mat-stroked-button (click)="onNoClick()">No, dai. 😋</button>
    <button mat-stroked-button (click)="deleteRecipe(data.id)">Si, rimuovila! 😤</button>
  `
})
export class DialogConfermaRimuovi {
  constructor(
    public dialogRef: MatDialogRef<DialogConfermaRimuovi>,
    @Inject(MAT_DIALOG_DATA) public data: {id:string|number},
    private recipeSrv:RecipeService
  ) {}
  deleteRecipe(id:number|string){
    this.recipeSrv.deleteRecipe(id)
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
