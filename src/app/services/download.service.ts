import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private http: HttpClient, private authsv: AuthService) { }
  downloadAudio(id: string){
    return this.http.get(`${this.authsv.base}/yt/download/audio/${id}`);
  }
  downloadVideo(id: string, resolution: string){
    return this.http.get(`${this.authsv.base}/yt/download/${id}?resolution=${resolution}`);
  }
}
