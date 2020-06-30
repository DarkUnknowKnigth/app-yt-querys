import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuth = false;
  public base = 'https://y2b-downloader.herokuapp.com';
  // public base = 'http://localhost:3000';
  // public base = 'http://192.168.100.18:3000';
  public soureceAuth = new BehaviorSubject<any>({});
  public authStatus = this.soureceAuth.asObservable();
  public role = 0;
  public headers : HttpHeaders;
  constructor(private http: HttpClient, public fbAuth: AngularFireAuth) {
    const user = JSON.parse(localStorage.getItem('__TYD_USER__'));
    if(user){
      this.setAuthStatus(user);
    }
  }
  setAuthStatus(newAuth: any){
    this.isAuth = newAuth._id;
    this.role = newAuth.role;
    if(newAuth._id){
      this.headers = new HttpHeaders({
        'Session': newAuth.session,
      });
    }
    localStorage.setItem('__TYD_USER__', JSON.stringify(newAuth));
    this.soureceAuth.next(newAuth);
  }
  uploadPhoto(file: any, id: string){
    const data = new FormData();
    data.append('photo', file);
    return this.http.post(`${this.base}/photo/${id}`, data);
  }
  register(data: any){
    return this.http.post(`${this.base}/register`, data);
  }
  login(e: string, p: string){
    localStorage.setItem('email',e);
    return this.http.post(`${this.base}/login`,{email:e, password:p});
  }
  logout(){
    localStorage.removeItem('__TYD_USER__');
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
