import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu } from 'src/models/menu.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}
  loadedMenus: Menu[] = [];
  getAllMenus() {
    return this.http
      .get<Menu[]>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/menus.json'
      )
      .pipe(
        map((response) => {
          const menus: Menu[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              menus.push({ ...response[key], id: key });
            }
          }
          return menus;
        })
      );
  }
  getMenu(id:string){
    return this.http
      .get<Menu>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/menus/'+id+'.json'
      ).pipe(
        map((response) => {
          let Menu: Menu =response;
          Menu.id=id
          return Menu
        })
      )
  }
  addMenu(menu: Menu) {
    return this.http
      .post<Menu>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/menus.json',
        menu
      )
  }
  editMenu(menu: Menu,id:string|number){
    return this.http
      .put<Menu>(
        'https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/menus/'+id+'.json',
        menu
      )
  }
  deleteMenu(id:number|string){
    this.http.delete('https://kiweest-default-rtdb.europe-west1.firebasedatabase.app/menus/'+id+'.json').subscribe()
  }
}
