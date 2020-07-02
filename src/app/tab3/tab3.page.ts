import { Component, ViewChild,  } from '@angular/core';
import { SongService } from '../services/song.service';
import {Howl, Howler} from 'howler';
import { IonRange, Animation, AnimationController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DownloadService } from '../services/download.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{
  repeating = false;
  isRandom = false;
  prevRandom :number;
  songs: any[] = [];
  videos: any[] = [];
  resolution = '480';
  showing: string;
  base ='';
  searchSongs: any[] = [];
  searchVideos: any[] = [];
  player: Howl = null;
  playingSong: any = {}
  isPlaying = false;
  progress;
  querySong = '';
  queryVideo = '';
  displayProgress = '';
  user: any;
  animation: Animation;
  @ViewChild('range') range:IonRange;
  constructor(private authsv:AuthService ,public songsv: SongService,
    private route: ActivatedRoute, private dwlsv:DownloadService, private animationCtrl: AnimationController) {
    this.authsv.authStatus.subscribe(user => this.user = user);
    this.showing='songs';
    this.songsv.currentSongs.subscribe( songs => {
      this.songs = songs;
      this.shoudlPlay();
    });
    this.dwlsv.currentVideos.subscribe( videos  => {
      this.videos = videos;
      this.shoudlPlay();
    });
    this.songsv.all().subscribe( resp => {
      this.songsv.updateSongsList(resp['songs']);
    }, err => {
      console.error(err);
    });
    this.dwlsv.all().subscribe( resp => {
      this.dwlsv.updateVideoList(resp['videos']);
    }, err =>{
      console.error(err);
    });
    this.base = this.dwlsv.getApiUrl();
  }
  searchSong(){
    this.searchSongs = this.songs.filter(song => song.title.toLowerCase().includes(this.querySong));
  }
  searchVideo(){
    this.searchVideos = this.videos.filter(video => video.title.toLowerCase().includes(this.queryVideo));
  }
  shoudlPlay(){
    const id = this.route.snapshot.queryParams.id;
    const download = this.route.snapshot.queryParams.download;
    if (id !== undefined) {
      if (id.length === 11 && download === undefined) {
        const songQuery = this.songs.filter( song => song.id === id );
        if (songQuery.length > 0 && !this.isPlaying) {
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
  bigCover(){
    const regex = /hqdefault/gi;
    return this.playingSong.imagePath.replace(regex,'maxresdefault');
  }
  show(view :string){
    this.showing = view;
  }
  start(song: any){
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src:[song.path],
      html5:true,
      onpause: ()=>{
        this.isPlaying = false;
      },
      onplay:() => {
        this.isPlaying = true;
        this.playingSong = song;
        this.updateProgress();
      },
      onend: () =>{
        if(this.repeating){
          this.start(this.playingSong);
        }else{
          this.next();
        }
      },
      onloaderror: (e)=>{
        console.log(e);
      }
    });
    this.animation = this.animationCtrl.create()
    .addElement(document.getElementById('title-mini'))
    .duration(15000)
    .iterations(Infinity)
    .keyframes([
      { offset: 0, transform: 'translateX(0%)'},
      { offset: 0.5, transform: 'translateX(-60%)'},
      { offset: 1, transform: 'translateX(0%)'},
    ]);
    this.animation.play();
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
    if(this.isRandom){
      this.start(this.songs[this.prevRandom]);
    }
    else{
      const i = this.songs.indexOf(this.playingSong);
      if( i > 0 ){
        this.start(this.songs[i-1]);
      }else{
        this.start(this.songs[this.songs.length - 1]);
      }
    }
  }
  next(){
    if(this.isRandom){
      const track = Math.floor(Math.random() * this.songs.length);
      this.prevRandom = this.songs.indexOf(this.playingSong);
      this.start(this.songs[track]);
    }else{
      const i = this.songs.indexOf(this.playingSong);
      if( i !== this.songs.length -1 ){
        this.start(this.songs[i + 1]);
      }else{
        this.start(this.songs[0]);
      }
    }
  }
  seek(){
    const newValue =+  this.range.value;
    const duration = this.player.duration();
    this.player.seek(duration * newValue / 100);
  }
  seekMore(){
    const now = this.player.seek();
    this.player.seek(now+10);
  }
  seekLess(){
    const now = this.player.seek();
    this.player.seek(now-10);
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
