import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authsv: AuthService) { }
  all(){
    return this.http.get(`${this.authsv.base}/users`);
  }
  get(id: string){
    return this.http.get(`${this.authsv.base}/users/${id}`)
  }
  update(id: string,data: any){
    return this.http.put(`${this.authsv.base}/users/${id}`, data);
  }
  delete(id: string){
    return this.http.delete(`${this.authsv.base}/users/${id}`);
  }
}

