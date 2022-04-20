import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/sevices/setting.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private ux:SettingService) { }
  vibrate(){
    this.ux.vibrate()
  }


  ngOnInit(): void {
  }

}
