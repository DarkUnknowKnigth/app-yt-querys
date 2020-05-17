import { Component, ViewChild } from '@angular/core';
import { SongService } from '../services/song.service';
import {Howl, Howler} from 'howler';
import { IonRange } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  songs: any[] = [];
  base = 'http://localhost:3000';
  player: Howl = null;
  playingSong: any = {}
  isPlaying = false;
  progress;
  displayProgress = '';
  @ViewChild('range') range:IonRange;
  constructor(private songsv: SongService) {
    this.songsv.all().subscribe( resp => {
      this.songs = resp['songs'];
    }, err => {
      console.log(err);
    });
  }
  start(song: any){
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
  download(song: any){
    window.open(this.base+'/yt'+song.pathDownload,'_blank');
  }
  delete(song: any){
    this.songs = this.songs.filter( _song => _song.id !== song.id );
    this.songsv.delete(song.id).subscribe( resp => {
      console.log(resp);
    }, err => {
      console.log(err);
    });
  }
}
