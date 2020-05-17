import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.component.html',
  styleUrls: ['./tab4.component.scss'],
})
export class Tab4Component implements OnInit {
  constructor(public auth : AuthService) {
  }
  ngOnInit() {}
  loginG(){
    this.auth.loginGoogle()
  }
}
