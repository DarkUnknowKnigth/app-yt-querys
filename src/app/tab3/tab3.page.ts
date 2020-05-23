import { Component, ViewChild, OnChanges, SimpleChange } from '@angular/core';
import { SongService } from '../services/song.service';
import {Howl, Howler} from 'howler';
import { IonRange } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DownloadService } from '../services/download.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  songs: any[] = [];
  videos: any[] = [];
  resolution = '480';
  showing: string;
  base ='';
  player: Howl = null;
  playingSong: any = {}
  isPlaying = false;
  progress;
  displayProgress = '';
  @ViewChild('range') range:IonRange;
  constructor(private songsv: SongService, private route: ActivatedRoute, private dwlsv:DownloadService) {
    this.showing='songs';
    this.songsv.all().subscribe( resp => {
      this.songsv.updateSongsList(resp['songs']);
      this.songsv.currentSongs.subscribe( songs => {
        this.songs = songs;
        this.shoudlPlay();
      });
      this.dwlsv.all().subscribe( resp => {
        this.dwlsv.updateVideoList(resp['videos']);
        this.dwlsv.currentVideos.subscribe( videos  => {
          this.videos = videos;
          this.shoudlPlay();
        });
      }, err =>{
        console.error(err);
      });
    }, err => {
      console.error(err);
    });
    this.base = this.dwlsv.getApiUrl();
  }
  shoudlPlay(){
    const id = this.route.snapshot.queryParams.id;
    const download = this.route.snapshot.queryParams.download;
    if (id !== undefined) {
      if (id.length === 11 && download === undefined) {
        const songQuery = this.songs.filter( song => song.id === id );
        if (songQuery.length > 0) {
          this.isPlaying = true;
          this.start(songQuery[0]);
        }
      }
      else{
        if (download !== undefined) {
          if (download === '1'){
            const videoQuery = this.videos.filter( video => video.id === id );
            if(videoQuery.length > 0){
              this.download(videoQuery[0],'video');
            }
          }
        }
      }
    }
  }
  show(view :string){
    this.showing = view;
  }
  start(song: any){
    this.showing='player'
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src:[this.base+song.path],
      html5:true,
      onplay:() => {
        this.isPlaying = true;
        this.playingSong = song;
        this.updateProgress();
      },
      onend: () =>{
        const i = this.songs.indexOf(this.playingSong);
        if( i !== this.songs.length -1 ){
          this.start(this.songs[i + 1]);
        }else{
          this.start(this.songs[0]);
        }
      }
    });
    this.player.play();
  }
  togglePlayer(pause: boolean){
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }
  prev(){
    const i = this.songs.indexOf(this.playingSong);
    if( i > 0 ){
      this.start(this.songs[i-1]);
    }else{
      this.start(this.songs[this.songs.length - 1]);
    }
  }
  next(){
    const i = this.songs.indexOf(this.playingSong);
    if( i !== this.songs.length -1 ){
      this.start(this.songs[i + 1]);
    }else{
      this.start(this.songs[0]);
    }
  }
  seek(){
    const newValue =+  this.range.value;
    const duration = this.player.duration();
    this.player.seek(duration * newValue / 100);
  }
  updateProgress(){
    const seek = this.player.seek();
    const notParsed = Math.floor(this.progress*this.player.duration() /100);
    const m = Math.floor(notParsed / 60);
    const s = notParsed % 60;
    this.progress = (seek/this.player.duration()) *100 || 0;
    this.displayProgress = `${m<9 ?'0'+m:m}:${s<9 ?'0'+s:s}`;
    setTimeout(()=>{
      this.updateProgress();
    },1000);
  }
  download(file: any,type: string){
    this.dwlsv.save(file.pathDownload, this.resolution);
  }
  deleteVideo(video: any){
    this.dwlsv.delete(video.id).subscribe( resp => {
      console.log(resp);
      this.videos = this.videos.filter( _video => _video.id !== video.id );
    }, err => {
      console.log(err);
    });
  }
  delete(song: any){
    this.songsv.delete(song.id).subscribe( resp => {
      console.log(resp);
      this.songs = this.songs.filter( _song => _song.id !== song.id );
    }, err => {
      console.log(err);
    });
  }
}
