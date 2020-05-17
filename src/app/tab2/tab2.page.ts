import { Component } from '@angular/core';
import { DownloadService } from '../services/download.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';

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
  constructor(private dwlsv: DownloadService,public toastsv: ToastService,private router:Router) {
  }
  download(){
    if (this.url.includes('v=')) {
      const id =this.url.slice(this.url.search(/[v=]/)+2)
      if(id.length === 11){
        if(this.type === 'audio'){
          this.toastsv.presentToast('Downloading');
          this.dwlsv.downloadAudio(id).subscribe( resp => {
            console.log(resp);
            this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩');
            this.router.navigateByUrl('/tabs/player');
          }, err =>{
            this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
          });
        }
        if(this.type === 'video'){
          this.toastsv.presentToast('Downloading');
          this.dwlsv.downloadVideo(id,this.resolution).subscribe( resp => {
            this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩');
            this.router.navigateByUrl('/tabs/player');
          }, err =>{
            this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
          });
        }
      }

    }
  }
}
