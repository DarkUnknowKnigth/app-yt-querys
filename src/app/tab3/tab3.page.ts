import { Component, ViewChild, OnInit, Output, Input, HostListener } from '@angular/core';
import { SongService } from '../services/song.service';
import {Howl, Howler} from 'howler';
import { IonRange, Animation, AnimationController, IonSegment, Platform, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DownloadService } from '../services/download.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../toast.service';
import { Plugins, NotificationChannel, LocalNotificationActionPerformed } from '@capacitor/core';
import { SongModel } from '../models/song.model';
const { LocalNotifications, CapacitorMusicControls } = Plugins;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  repeating = false;
  isRandom = false;
  updating = false;
  prevRandom :number;
  updatingSong: any;
  updateTitle = '';
  updateArtist = '';
  songs: SongModel[] = [];
  videos: any[] = [];
  resolution = '480';
  showing: string;
  base ='';
  searchSongs: any[] = [];
  searchVideos: any[] = [];
  player: Howl = null;
  playingSong: SongModel = new SongModel();
  isPlaying = false;
  loading = false;
  progress;
  querySong = '';
  linksCover = [];
  queryVideo = '';
  displayProgress = '';
  user: any;
  animation: Animation;
  chanel: NotificationChannel;
  showLyrics = false;
  lyrics = 'Not avalible';
  isDesktop = false;
  @ViewChild('segment', {static:true}) segment: IonSegment;
  @ViewChild('range') range:IonRange;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.plt.ready().then(()=>{
      this.isDesktop = this.plt.is('desktop');
    });
  }
  constructor(private authsv:AuthService ,public songsv: SongService,
  private route: ActivatedRoute, private dwlsv:DownloadService, private animationCtrl: AnimationController,
  private toastsv: ToastService, private plt: Platform, public asc: ActionSheetController) {
    this.authsv.authStatus.subscribe(user => this.user = user);
    this.showing='songs';
    this.loading = true;
    this.songsv.all().subscribe( resp => {
      this.songsv.updateSongsList(resp['songs']);
      this.loading = false;
      this.songsv.currentSongs.subscribe( songs => {
        this.songs = songs;
      });
    }, err => {
      console.error(err);
    });
    this.dwlsv.all().subscribe( resp => {
      this.dwlsv.updateVideoList(resp['videos']);
      this.dwlsv.currentVideos.subscribe( videos  => {
        this.videos = videos;
      });
    }, err =>{
      console.error(err);
    });
    this.base = this.dwlsv.getApiUrl();
  }
  // funcion que invoca el menu
  async presentActionSheet(song: SongModel) {
    const buttonsSU = [
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.delete(song);
        }
      },
      {
        text: 'Update',
        icon: 'create',
        handler: () => {
          this.updatingSong = song;
          this.updating = true;
          this.updateTitle= song.title;
          this.updateArtist = song.artist
        }
      },
      {
        text: 'Download',
        icon: 'download',
        handler: () => {
          this.download(song,'audio');
        }
      },
    ];
    const buttons =[
      {
        text: 'Download',
        icon: 'download',
        handler: () => {
          this.download(song,'audio');
        }
      },
    ];
    const actionSheet = await this.asc.create({
      header: 'Options',
      cssClass: 'action-custom',
      buttons: this.user.role === 666 ? buttonsSU:buttons
    });
    await actionSheet.present();
  }
  ngOnInit(){
    this.getScreenSize();
    // if(this.plt.is('android') === true){
    //   await LocalNotifications.requestPermission();
    //   // Creating buttons below notification
    //   LocalNotifications.registerActionTypes({
    //     types:[
    //       {
    //         id: 'sound-background',
    //         actions: [
    //           {
    //             id: 'prev',
    //             title: 'Prev',
    //           },
    //           {
    //             id: 'play',
    //             title: 'Play',
    //           },
    //           {
    //             id: 'next',
    //             title: 'Next',
    //           },
    //         ]
    //       }
    //     ]
    //   });
    //   LocalNotifications.addListener('localNotificationActionPerformed', (notification: LocalNotificationActionPerformed) => {
    //     console.log(notification.inputValue)
    //     switch(notification.actionId){
    //       case 'play':
    //         this.togglePlayer(this.isPlaying);
    //         break;
    //       case 'prev':
    //         this.prev();
    //         break;
    //       case 'next':
    //         this.next();
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    //   // Creating channel without vibration
    //   LocalNotifications.createChannel({
    //     id: 'yt-chanel',
    //     importance: 1,
    //     name: 'yt-download',
    //     sound: null,
    //     vibration: false,
    //     lights: false,
    //     visibility: 1
    //   });
    //   CapacitorMusicControls.addListener('controlsNotification', (action: any) => {
    //     const message = action.message;
    //     switch(message) {
    //       case 'music-controls-next':
    //         this.next();
    //         break;
    //       case 'music-controls-previous':
    //         this.prev();
    //         break;
    //       case 'music-controls-pause':
    //         this.togglePlayer(true);
    //         break;
    //       case 'music-controls-play':
    //         this.togglePlayer(false);
    //         break;
    //       case 'music-controls-destroy':
    //         this.player.pause();
    //         this.isPlaying = false;
    //         CapacitorMusicControls.updateIsPlaying({
    //           isPlaying: false, // affects Android only
    //         });
    //         break;
    //       // External controls (iOS only)
    //       case 'music-controls-toggle-play-pause' :
    //         if(this.isPlaying){
    //           this.player.pause();
    //           this.isPlaying = false;
    //           CapacitorMusicControls.updateIsPlaying({
    //             isPlaying: false, // affects Android only
    //           });
    //         }else{
    //           this.player.play();
    //           this.isPlaying = true;
    //           CapacitorMusicControls.updateIsPlaying({
    //             isPlaying: true, // affects Android only
    //           });
    //         }
    //         break;
    //       case 'music-controls-seek-to':
    //         const seekToInSeconds = JSON.parse(action).position;
    //         this.seekMore();
    //         // Do something
    //         break;
    //       case 'music-controls-skip-forward':
    //         // Do something
    //         this.next();
    //         break;
    //       case 'music-controls-skip-backward':
    //         // Do something
    //         this.prev();
    //         break;
    //       // Headset events (Android only)
    //       // All media button events are listed below
    //       case 'music-controls-media-button' :
    //         if(this.isPlaying){
    //           this.player.pause();
    //           this.isPlaying = false;
    //           CapacitorMusicControls.updateIsPlaying({
    //             isPlaying: false, // affects Android only
    //           });
    //         }else{
    //           this.player.play();
    //           this.isPlaying = true;
    //           CapacitorMusicControls.updateIsPlaying({
    //             isPlaying: true, // affects Android only
    //           });
    //         }
    //         break;
    //       case 'music-controls-headset-unplugged':
    //         // Do something
    //         this.player.pause();
    //         this.isPlaying = false;
    //         break;
    //       case 'music-controls-headset-plugged':
    //         this.player.play();
    //         this.isPlaying = true;
    //         break;
    //       default:
    //         break;
    //     }
    //   }, success=>{
    //     console.log(success);
    //   }, error=>{
    //     console.log(error);
    //   });
    // }
    this.segment.value = 'songs';
  }
  copyClipboard(url: string){
    navigator.clipboard.writeText(url);
  }
  segmentChanged(ev: any){
    this.showing = ev.detail.value;
  }
  searchSong(){
    if(this.querySong.length > 0){
      this.searchSongs = this.songs.filter(song => song.title.toLowerCase().includes(this.querySong));
    } else {
      this.searchSongs = [];
    }
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
          console.log(id);
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
    this.segment.value = view;
  }
  start(song: SongModel){
    this.lyrics = 'Loading ....';
    this.songsv.getLyrics(song).subscribe(resp =>{
      if(resp['lyrics']){
        this.lyrics = '<table>'+resp['lyrics'].split('\n').map( row => '<tr><td>'+row+'</td><tr>').join('')+'</table>';
      }else {
        this.lyrics ='Error!';
      }
    }, err=>{
      console.log(err);
      this.lyrics = 'Not found 😒'
    });
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src:[song.path],
      html5:true,
      autoplay: false,
      loop: false,
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
    this.player.play();
    const index = this.songs.indexOf(song);
    if (index === 0) {
      this.linksCover = [ this.songs[this.songs.length-1].imagePath, this.songs[index].imagePath, this.songs[index+1].imagePath];
    }
    if (index === (this.songs.length - 1)) {

      this.linksCover = [ this.songs[index-1].imagePath, this.songs[index].imagePath, this.songs[0].imagePath];
    }
    if (index > 0 && index < this.songs.length - 2) {
      this.linksCover = [ this.songs[index-1].imagePath, this.songs[index].imagePath, this.songs[index+1].imagePath];
    }
    // if(this.plt.is('android')){
    //   CapacitorMusicControls.create({
    //     track: song.title,		// optional, default : ''
    //     artist: song.artist,						// optional, default : ''
    //     album: 'YT-DOWNLOAD',     // optional, default: ''
    //     cover: song.imagePath,
    //     isPlaying: true,
    //     dismissable: true,
    //     hasPrev: true,      // show previous button, optional, default: true
    //     hasNext: true,      // show next button, optional, default: true
    //     hasClose  : false,       // show close button, optional, default: false
    //   // iOS only, optional
    //     hasSkipForward : true,  // show skip forward button, optional, default: false
    //     hasSkipBackward : true, // show skip backward button, optional, default: false
    //     hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional
    //     // Android only, optional
    //     ticker: `Now Playing "${song.title} - ${song.artist}"`,
    //     // text displayed in the status bar when the notification (and the ticker) are updated, optional
    //     // All icons default to their built-in android equivalents
    //     playIcon: 'media_play',
    //     pauseIcon: 'media_pause',
    //     prevIcon: 'media_prev',
    //     nextIcon: 'media_next',
    //     closeIcon: 'media_close',
    //     notificationIcon: 'notification'
    //   });
    //   CapacitorMusicControls.updateIsPlaying({
    //     isPlaying: true, // affects Android only
    //   });
    // }
  }
  togglePlayer(pause: boolean){
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
      // if(this.plt.is('android')){
      //   CapacitorMusicControls.updateIsPlaying({
      //     isPlaying: false, // affects Android only
      //   });
      // }
    } else {
      this.player.play();
      // if(this.plt.is('android')){
      //   CapacitorMusicControls.updateIsPlaying({
      //     isPlaying: true, // affects Android only
      //   });
      // }
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
  async download(file: any, type: string){
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Downloading: '+file.title,
          body: 'Artist: '+file.artist,
          id: 2,
        }
      ]
    });
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
  delete(song: SongModel){
    this.songsv.delete(song.id).subscribe( resp => {
      console.log(resp);
      this.songs = this.songs.filter( _song => _song.id !== song.id );
    }, err => {
      console.log(err);
    });
  }
  update(song: SongModel){
    const data = {
      title: this.updateTitle.length > 0 ? this.updateTitle : this.updatingSong.title,
      artist: this.updateArtist.length > 0 ? this.updateArtist : this.updatingSong.artist
    }
    this.songsv.update(song.id, data).subscribe( resp => {
      this.toastsv.presentToast(resp['message']);
      this.songsv.all().subscribe( resp2 => {
        this.songsv.updateSongsList(resp2['songs']);
        this.updating = false;
        this.updateTitle = '';
        this.updateArtist = '';
      }, err => {
        console.error(err);
      });
    }, err => {
      console.log(err);
      this.toastsv.presentToast( err['message']);
    });
  }
}
