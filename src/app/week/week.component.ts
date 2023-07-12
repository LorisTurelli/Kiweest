import { Component, Inject, OnInit } from '@angular/core';
import { Menu } from 'src/models/menu.model';
import { MenuService } from 'src/sevices/menu.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit {

  constructor(private menuSrv:MenuService,public dialog: MatDialog) { }
  displayedColumns: string[] = ['name','commands'];
  dataSource!:MatTableDataSource<Menu>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.getAllMenus()
  }

  getAllMenus() {
    this.menuSrv.getAllMenus().subscribe(menus=>{
      this.dataSource = new MatTableDataSource(menus);
    });
  }

  //Funzioni Dialog
  deleteMenu(menuId?:string|number) {
    const dialogRef = this.dialog.open(DialogConfermaRimuoviMenu, {
      data: {id:menuId},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllMenus()
    });
  }
}
//Componente Dialog
@Component({
  selector: 'dialog-ingredient',
  template: `<h3>Confermi?</h3>
    <p>Se elimini questo menu, non potrai più utilizzarlo.</p>
    <button mat-stroked-button style="width:49%;margin-right:2%" (click)="onNoClick()">No, dai. 😋</button>
    <button mat-stroked-button color="primary" style="width:49%" (click)="deleteMenu(data.id)">Si, rimuovilo! 😤</button>
  `
})
export class DialogConfermaRimuoviMenu {
  constructor(
    public dialogRef: MatDialogRef<DialogConfermaRimuoviMenu>,
    @Inject(MAT_DIALOG_DATA) public data: {id:string|number},
    private menuSrv:MenuService
  ) {}
  deleteMenu(id:number|string){
    this.menuSrv.deleteMenu(id)
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
