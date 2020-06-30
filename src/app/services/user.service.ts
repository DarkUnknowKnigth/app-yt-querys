import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authsv: AuthService) {}
  all(){
    console.log(this.authsv.headers);
    return this.http.get(`${this.authsv.base}/users`, { headers: this.authsv.headers});
  }
  get(id: string){
    return this.http.get(`${this.authsv.base}/users/${id}`,{ headers: this.authsv.headers})
  }
  update(id: string, data: any){
    return this.http.put(`${this.authsv.base}/users/${id}`, data,{ headers: this.authsv.headers});
  }
  delete(id: string){
    return this.http.delete(`${this.authsv.base}/users/${id}`,{ headers: this.authsv.headers});
  }
  playlists(){
  }
  addPlaylist(){
  }
  removePlaylist(){
  }
  updatePlaylist(){
  }
}

