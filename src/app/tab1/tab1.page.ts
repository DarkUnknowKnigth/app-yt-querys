import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { UserService } from '../services/user.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user: any;
  data = {
    name: '',
    email:'',
    file: null
  };
  constructor(public auth: AuthService, private router :Router, private usersv: UserService, private toastsv: ToastService) {
    this.auth.authStatus.subscribe( user =>{
      this.user = user;
      this.data.name = this.user.name;
      this.data.email = this.user.email;
    });
  }
  logout(){
    this.auth.logout().subscribe(resp => {
      this.auth.setAuthStatus({});
      this.router.navigateByUrl('/tabs/player');
    }, err => {
      console.log(err);
    });
  }
  onFileChanged(event) {
    this.data.file = event.target.files[0];
  }
  save(img: any) {
    img.click();
  }
  update(){
    this.usersv.update( this.user._id, this.data ).subscribe( resp => {
      this.toastsv.presentToast('User updated 😉');
      const user = resp['user'];
      user.session = resp['session'];
      this.auth.setAuthStatus(user);
    }, err => {
      this.toastsv.presentToast('Error when update 🤔🤔')
    });
    if(this.data.file){
      const uid = this.user._id;
      this.auth.uploadPhoto(this.data.file,uid).subscribe( resp => {
        this.toastsv.presentToast('Photo updated 🤩');
      }, err => {
        console.log(err);
        this.toastsv.presentToast('Photo not saved🙂');
      });
    }
  }
}
