import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public base = 'http://localhost/';
  public user: any = {};
  constructor(private http: HttpClient, public fbAuth: AngularFireAuth) {
    this.fbAuth.authState.subscribe( user => {
      console.log(user);
      if(!user){return;}
      this.user.uid = user.uid;
      this.user.name = user.displayName;
      this.user.email = user.email;
      this.user.photo = user.photoURL;
    });
  }
  register(){}
  login(email: string, password: string){
  }
  logout(){}
  loginGoogle(){
    this.fbAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logoutGoogle(){
    this.fbAuth.signOut();
  }
  google(){
  }

}
