import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isMobileScreen = false;

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

  abrirPreenchimentoDeCep() {
    console.log('Abriu dialog . . .');

  }

}
