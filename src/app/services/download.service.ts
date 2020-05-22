import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { SongService } from './song.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private http: HttpClient, private authsv: AuthService,private songsv: SongService) { }
  private videoSource = new BehaviorSubject<any[]>([]);
  public currentVideos = this.videoSource.asObservable();
  downloadAudio(id: string){
    return this.http.get(`${this.authsv.base}/yt/download/audio/${id}`);
  }
  downloadVideo(id: string, resolution: string){
    return this.http.get(`${this.authsv.base}/yt/download/${id}?resolution=${resolution}`);
  }
  all(){
    return this.http.get(`${this.authsv.base}/videos`);
  }
  updateVideoList(videos: any[]){
    this.videoSource.next(videos);
  }
  delete(id: string){
    return this.http.delete(`${this.authsv.base}/videos/${id}`);
  }
  save(filePath: string, resolution: string){
    window.open(`${this.authsv.base}/yt${filePath}&resolution=${resolution}`,'_blank');
  }
  getApiUrl(){
    return this.authsv.base;
  }
}
