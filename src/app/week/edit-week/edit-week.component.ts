import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Day } from 'src/models/menu.model';
import { Recipe } from 'src/models/recipe.model';
import { RecipeService } from 'src/sevices/recipe.service';
import {
  CdkDragDrop,
  CdkDragMove,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-week',
  templateUrl: './edit-week.component.html',
  styleUrls: ['./edit-week.component.scss'],
})
export class EditWeekComponent {
  constructor(public dialog: MatDialog) {
    this.setDuration();
  }
  dataSource!: MatTableDataSource<Day>;
  displayedColumns: string[] = ['date', 'lunch', 'dinner'];
  days: Day[] = [];
  dropTargetIds: string[] = [];
  weekForm = new FormGroup({
    start: new FormControl(new Date()),
    duration: new FormControl(15),
  });
  setDuration() {
    let startDate = this.weekForm.controls['start'].value;
    let duration = this.weekForm.controls['duration'].value;
    let difference = duration - this.days.length;
    if (difference >= 0) {
      for (let i = this.days.length; i < duration; i++) {
        let date: Date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        this.days.push({ date: date, lunch: [], dinner: [] });
        this.dropTargetIds.push('cdk-drop-list-' + i * 2);
        this.dropTargetIds.push('cdk-drop-list-' + (i * 2 + 1));
      }
    } else {
      for (let i = this.days.length; i > duration; i--) {
        this.days.pop();
      }
    }
    this.dataSource = new MatTableDataSource(this.days);
  }
  setDate() {
    let startDate = this.weekForm.controls['start'].value;
    for (let i = 0; i < this.days.length; i++) {
      let date: Date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      this.days[i].date = date;
    }
  }
  removeRecipe(date: Date, name: string, path: string) {
    let currentDay = this.days[this.days.findIndex((obj) => obj.date === date)];
    if (path == 'lunch') {
      currentDay.lunch?.splice(
        currentDay.lunch?.findIndex((obj) => obj.name === name),
        1
      );
    }
    if (path == 'dinner') {
      currentDay.dinner?.splice(
        currentDay.dinner?.findIndex((obj) => obj.name === name),
        1
      );
    }
  }
  //Funzioni drag&drop
  drop(event: CdkDragDrop<Recipe[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  //Funzioni Dialog
  selectRecipe(day: Day, meal: string) {
    const dialogRef = this.dialog.open(SelectRecipeDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: { day: day, meal: meal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let currentDay =
          this.days[this.days.findIndex((obj) => obj.date === result.day.date)];
        if (result.meal == 'lunch') {
          if (currentDay.lunch == null) {
            currentDay.lunch = [];
          }
          currentDay.lunch.push(result.recipe);
        }
        if (result.meal == 'dinner') {
          if (currentDay.dinner == null) {
            currentDay.dinner = [];
          }
          currentDay.dinner.push(result.recipe);
        }
      }
    });
  }
}

@Component({
  templateUrl: 'select-recipe-dialog.component.html',
  styles: [
    `
      td {
        position: relative;
        button {
          position: absolute;
          right: 5px;
          top: 5px;
        }
      }
    `,
  ],
})
export class SelectRecipeDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SelectRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { day: Day; meal: string },
    private recipeSrv: RecipeService
  ) {}

  displayedColumns: string[] = ['name'];
  dataSource!: MatTableDataSource<Recipe>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.recipeSrv.getAllRecepies().subscribe((recipes) => {
      this.dataSource = new MatTableDataSource(recipes);
    });
  }
}
