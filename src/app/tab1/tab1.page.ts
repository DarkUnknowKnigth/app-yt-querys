import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user: any;
  constructor(public auth: AuthService, private router :Router) {
    this.auth.authStatus.subscribe( user => this.user = user);
  }
  logout(){
    this.auth.logout().subscribe(resp => {
      console.log(resp);
      this.router.navigateByUrl('/tabs/player');
    }, err => {
      console.log(err);
    });
  }
}
