import { Component } from '@angular/core';
import { DownloadService } from '../services/download.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  url: string;
  type: string;
  resolution:string;
  downloading = false;
  constructor(private dwlsv: DownloadService, public toastsv: ToastService, private router:Router, private songsv: SongService) {
  }
  download(){
    if (!this.url && !this.type) {
      this.toastsv.presentToastWithOptions('Error !!! 😪','Please put data in the form 🙏🙏');
      return;
    }
    if (this.url.includes('v=')) {
      const id =this.url.slice(this.url.search(/[v=]/)+2)
      if(id.length === 11){
        if(this.type === 'audio'){
          this.toastsv.presentToast('Downloading');
          this.downloading =true;
          this.dwlsv.downloadAudio(id).subscribe( resp => {
            this.songsv.updateSongsList(resp['songs']);
            this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩');
            this.downloading=false;
            this.router.navigateByUrl('/tabs/player?id='+resp['song'].id);
          }, err =>{
            this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
          });
        }
        if(this.type === 'video'){
          this.toastsv.presentToast('Downloading');
          this.downloading =true;
          this.dwlsv.downloadVideo(id,this.resolution).subscribe( resp => {
            this.dwlsv.updateVideoList(resp['videos']);
            this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩');
            this.downloading=false;
            this.router.navigateByUrl('/tabs/player');
          }, err =>{
            this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
          });
        }
      }else{
        this.toastsv.presentToastWithOptions('Error !!! 😪',`Your ID (v=${id}) is wrong 🙄`);
        return;
      }
    }
    else{
      this.toastsv.presentToastWithOptions('Error !!! 😪','Your URL is wrong 🙄');
      return;
    }
  }
}
