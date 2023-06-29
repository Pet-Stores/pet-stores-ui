import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isMobileScreen: boolean = false;
  public showFiller: boolean = false;
  public openMenu: boolean = true

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      console.log(this.checkScreenSize());

      this.checkScreenSize();
    });
  }

  checkScreenSize() {
    this.isMobileScreen = window.innerWidth <= 1114;
  }

  funcaoTeste() {
    console.log('Abriu dialog . . .');
    if (this.openMenu) {
      this.openMenu = false
    } else {
      this.openMenu = true
    }
  }

}
