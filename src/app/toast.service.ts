import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastCtl: ToastController) { }
  async presentToast(msg: string) {
    const toast = await this.toastCtl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  async presentToastWithOptions(h: string, msg: string) {
    const toast = await this.toastCtl.create({
      header: h,
      message: msg,
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-circle-outline',
          text: 'Ok',
        }
      ]
    });
    toast.present();
  }
}
