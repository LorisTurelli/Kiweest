import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Menu,Day } from 'src/models/menu.model';
import { Recipe } from 'src/models/recipe.model';
import { RecipeService } from 'src/sevices/recipe.service';
import { MenuService } from 'src/sevices/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  constructor(
    public dialog: MatDialog,
    private menuSrv: MenuService,
    private router: Router,
    private route: ActivatedRoute
    ) {

  }
  private routeSub!: Subscription;
  dataSource!: MatTableDataSource<Day>;
  displayedColumns: string[] = ['date', 'lunch', 'dinner'];

  menuId!: string | number;
  name?:string='';
  menu: Day[] = [];
  start?:Date;
  days?:number;

  dropTargetIds: string[] = [];
  weekForm = new FormGroup({
    start: new FormControl(null),
    duration: new FormControl(null),
    name:new FormControl(null)
  });
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      if (params['id'] != undefined) {
        this.menuSrv.getMenu(params['id']).subscribe((res) => {
          this.menuId = params['id'];
          this.name = res.name;
          this.menu = res.menu;
          this.start = res.start;
          this.days = res.days;
          this.weekForm = new FormGroup({
            start: new FormControl(this.start, [Validators.required]),
            duration: new FormControl(this.days, [
              Validators.required,
              Validators.min(1)
            ]),
            name:new FormControl(this.name,[Validators.required])
          });
          this.setDuration();
        });
      }else{
        this.name="Menu del "+this.formatDate()
        this.weekForm = new FormGroup({
          start: new FormControl(new Date(), [Validators.required]),
          duration: new FormControl(8, [
            Validators.required,
            Validators.min(1)
          ]),
            name:new FormControl(this.name,[Validators.required])
        });
        this.setDuration();
      }
    });
  }
  formatDate(inputDate?:Date){
    let objectDate=inputDate||new Date();
    let day:string|number = objectDate.getDate();
    let month:string|number = objectDate.getMonth()+1;
    let year:string|number = objectDate.getFullYear();
    if (day < 10) day = '0' + day;
    if (month < 10) month = `0${month}`;
    return `${day}/${month}/${year}`
  }
  setDuration() {
    let startDate:Date = new Date(this.weekForm.controls['start'].value);
    if(this.weekForm.controls['duration'].value<=0)this.weekForm.controls['duration'].setValue(1)
    let days = this.weekForm.controls['duration'].value;
    let difference = days - this.menu.length;
    if (difference >= 0) {
      for (let i = this.menu.length; i < days; i++) {
        let date: Date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        this.menu.push({ date: date, lunch: [], dinner: [] });
        this.dropTargetIds.push('cdk-drop-list-' + i * 2);
        this.dropTargetIds.push('cdk-drop-list-' + (i * 2 + 1));
      }
    } else {
      for (let i = this.menu.length; i > days; i--) {
        this.menu.pop();
      }
    }
    this.dataSource = new MatTableDataSource(this.menu);
    this.days=days
  }
  setName(){
    this.name = this.weekForm.controls['name'].value;
  }
  setDate() {
    let startDate:Date = new Date(this.weekForm.controls['start'].value);
    for (let i = 0; i < this.menu.length; i++) {
      let date: Date = new Date(startDate);
      console.log(new Date(this.weekForm.controls['start'].value).toLocaleDateString())
      date.setDate(new Date(startDate).getDate() + i);;
      this.menu[i].date = date;
    }
  }
  removeRecipe(date: Date, name: string, path: string) {
    let currentDay = this.menu[this.menu.findIndex((obj) => obj.date === date)];
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
          this.menu[this.menu.findIndex((obj) => obj.date === result.day.date)];
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
  //funzioni HTTP
  submit() {
    let menu: Menu = {
      name: this.name,
      days:this.days?this.days:1,
      start: this.weekForm.controls['start'].value,
      menu: this.menu,
    };
      this.menuId
        ? this.menuSrv.editMenu(menu, this.menuId).subscribe(()=>{this.router.navigate(['week']);})
        : this.menuSrv.addMenu(menu).subscribe(()=>{this.router.navigate(['week']);});
      //this.router.navigate(['week']);
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
