import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.component.html',
  styleUrls: ['./tab4.component.scss'],
})
export class Tab4Component implements OnInit {
  data = {
    name:'',
    email:'',
    password:'',
    cpassword:'',
    file: null
  };
  log = {
    email:'',
    password:'',
  };
  isLogin = true;
  constructor(public auth : AuthService, private toastsv: ToastService, private router :Router) {}
  ngOnInit() {
    const email = localStorage.getItem('email');
    if(email){
      this.log.email = email;
    }
  }
  loginG(){
    this.auth.loginGoogle()
  }
  save(img: any) {
    img.click();
  }
  signin(form: any) {
    if (form.invalid || (this.data.cpassword !== this.data.password && this.data.password.length > 0 )) {
      const falis = [];
      form.invalid ? falis.push('Some errors in register form') : undefined ;
      this.data.name? undefined : falis.push('Plase give your name');
      this.data.email? undefined : falis.push('Plase give your email');
      this.data.password? undefined : falis.push('Plase give your password');
      this.data.cpassword ? undefined : falis.push('Plase confirm your password');
      (this.data.cpassword === this.data.password && this.data.password.length > 0 )? undefined : falis.push('Password not match');
      !this.data.email && this.data.email.includes('@') ? undefined : falis.push('Not valid email');
      this.toastsv.presentToast(falis.join(', '));
      return;
    }
    this.toastsv.presentToastWithOptions('Creating Account','Your account has been creating...');
    this.auth.register(this.data).subscribe(resp => {
      this.toastsv.presentToast('Account Created 🤩');
      this.log.email=resp['user'].email;
      this.isLogin = true;
      if(this.data.file && resp['user']){
        const uid = resp['user']._id;
        this.auth.uploadPhoto(this.data.file,uid).subscribe( resp2 => {
          this.toastsv.presentToast('Photo updated 🤩');
        }, err => {
          console.log(err);
          this.toastsv.presentToast('Photo not saved🙂');
        });
      }
    }, err => {
      console.log(err);
      this.toastsv.presentToast('Account not created 🙂');
    });
    console.log(this.data);
  }
  login (form :any) {
    if(form.invalid){
      const falis = [];
      form.invalid ? falis.push('Some errors in login form') : undefined ;
      this.log.email? undefined : falis.push('Plase give your email');
      this.log.password? undefined : falis.push('Plase give your password');
      !this.log.email && this.log.email.includes('@') ? undefined : falis.push('Not valid email');
      this.toastsv.presentToast(falis.join(', '));
      return;
    }
    if(this.log.password.length === 8 && this.log.email.length>0){
      this.auth.login(this.log.email,this.log.password).subscribe( resp => {
        console.log(resp);
        if(resp['user']){
          this.auth.setAuthStatus(resp['user']);
          this.log.password='';
          this.router.navigateByUrl('/tabs/player');
        }
      }, err => {
        console.log(err);
      });
    }
  }
  onFileChanged(event) {
    this.data.file = event.target.files[0];
  }
}
