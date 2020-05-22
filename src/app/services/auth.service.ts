import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public base = 'http://localhost:3000';
  public user: any = {};
  public soureceAuth = new BehaviorSubject<any>({});
  public authStatus = this.soureceAuth.asObservable();
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
  setAuthStatus(newAuth: any){
    this.soureceAuth.next(newAuth);
  }
  register(data: any){
    return this.http.post(`${this.base}/register`, data);
  }
  login(e: string, p: string){
    return this.http.post(`${this.base}/login`,{email:e, password:p});
  }
  logout(){
    return this.http.get(`${this.base}/logout`);
  }
  loginGoogle(){
    this.fbAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logoutGoogle(){
    this.fbAuth.signOut();
  }
  google(){
  }

}
