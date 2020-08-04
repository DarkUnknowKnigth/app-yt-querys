import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private songsSource = new BehaviorSubject<any[]>([]);
  public currentSongs = this.songsSource.asObservable();
  constructor(private http: HttpClient, private authsv: AuthService) { }
  all(){
    return this.http.get(`${this.authsv.base}/songs`);
  }
  get(id: string){
    return this.http.get(`${this.authsv.base}/songs/${id}`)
  }
  delete(id: string){
    return this.http.delete(`${this.authsv.base}/songs/${id}`);
  }
  update(id: string, data: any){
    return this.http.put(`${this.authsv.base}/songs/${id}`, data);
  }
  updateSongsList(songs: any[]){
    this.songsSource.next(songs);
  }
}
