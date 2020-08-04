import { Component } from '@angular/core';
import { DownloadService } from '../services/download.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  url = '';
  type = '';
  resolution:string;
  downloading = false;
  downloaded = true;
  help = false;
  constructor(private dwlsv: DownloadService, public toastsv: ToastService, private router:Router, private songsv: SongService) {
  }
  download(){
    this.downloading =true;
    this.downloaded = false;
    if (!this.url && !this.type) {
      this.toastsv.presentToastWithOptions('Error !!! 😪','Please put data in the form 🙏🙏');
      this.downloading=false;
      this.downloaded = true;
      return;
    }
    if (this.url.includes('v=')) {
      let id = '';
      if(this.url.includes('list=')){
        const temp= this.url.split('&list')[0];
        id = temp.slice(this.url.search(/[v=]/)+2,);
      }
      else{
        id = this.url.slice(this.url.search(/[v=]/)+2,);
      }
      // console.log('from pc:::'+ id);
      if(id.length === 11){
        if(this.type === 'audio'){
          this.toastsv.presentToast('Downloading');
          this.dwlsv.downloadAudio(id).subscribe( resp => {
            if(resp['songs'] && resp['songs'].length > 0){
              this.songsv.updateSongsList(resp['songs']);
              this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩 ' + resp['message']);
              this.downloading=false;
              this.downloaded = true;
              this.dwlsv.save(resp['song'].pathDownload, '');
              this.router.navigateByUrl('/tabs/player?id='+id);
            }else{
              this.toastsv.presentToastWithOptions('Something Wrong',JSON.stringify(resp));
            }
          }, err =>{
            console.log(err);
            this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
            this.downloading=false;
            this.downloaded = true;
          });
        }
        if(this.type === 'video'){
          this.toastsv.presentToast('Downloading');
          this.dwlsv.downloadVideo(id,this.resolution).subscribe( resp => {
            this.dwlsv.updateVideoList(resp['videos']);
            this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩' + resp['message']);
            this.router.navigateByUrl('/tabs/player?id='+resp['video'].id+'&download=1');
            this.downloading=false;
            this.downloaded = true;
          }, err =>{
            this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
            this.downloading=false;
            this.downloaded = true;
          });
        }
      }else{
        this.toastsv.presentToastWithOptions('Error !!! 😪',`Your ID (v=${id}) is wrong 🙄`);
        this.downloading=false;
        this.downloaded = true;
        return;
      }
    }else if(this.url.split('/').pop().length === 11)
    {
      const id = this.url.split('/').pop();
      // console.log('from device:::'+ id);
      if(this.type === 'audio'){
        this.toastsv.presentToast('Downloading');
        this.dwlsv.downloadAudio(id).subscribe( resp => {
          if(resp['songs'] && resp['songs'].length >0){
            this.songsv.updateSongsList(resp['songs']);
            this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩 ' + resp['message']);
            this.downloading=false;
            this.downloaded = true;
            this.router.navigateByUrl('/tabs/player?id='+id);
          }else{
            this.toastsv.presentToastWithOptions('Something Wrong',JSON.stringify(resp));
          }
        }, err =>{
          console.log(err);
          this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
          this.downloading=false;
          this.downloaded = true;
        });
      }
      if(this.type === 'video'){
        this.toastsv.presentToast('Downloading');
        this.dwlsv.downloadVideo(id,this.resolution).subscribe( resp => {
          this.dwlsv.updateVideoList(resp['videos']);
          this.toastsv.presentToastWithOptions('Downloaded','Your Download Is Ready 🤩' + resp['message']);
          this.router.navigateByUrl('/tabs/player?id='+resp['video'].id+'&download=1');
          this.downloading=false;
          this.downloaded = true;
        }, err =>{
          this.toastsv.presentToastWithOptions('Error', JSON.stringify(err));
          this.downloading=false;
          this.downloaded = true;
        });
      }
    }else{
      this.toastsv.presentToastWithOptions('Error !!! 😪','Your URL(from Device) is wrong 🙄');
      this.downloading =false;
      this.downloaded = true;
      return;
    }
  }
}
