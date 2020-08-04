import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users = [];
  showing = false;
  selectedUser;
  constructor(private usersv: UserService, private toastsv: ToastService ) {
    this.usersv.all().subscribe( resp => {
      this.users = resp['users'];
    }, err =>{
      console.log(err);
    });
  }

  ngOnInit() {
  }
  deleteUser(user: any){
    this.usersv.delete(user._id).subscribe( resp =>{
      if(resp['message'] === 'deleted'){
        this.users = resp['users'];
        this.toastsv.presentToast('Deleted 😒');
      }
    }, err=>{
      console.log(err);
    });
  }
}