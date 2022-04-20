import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  vibrationActive:boolean=true
  vibrate(){
    if(this.vibrationActive){
      window.navigator.vibrate(5)
    }
  }
  toggleVibration(){
    this.vibrationActive=!this.vibrationActive
  }

  constructor() { }
}
