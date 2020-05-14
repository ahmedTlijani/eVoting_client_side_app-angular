import { Component, OnInit, HostListener } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import { AuthService } from '../services/AuthService';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from '../services/customLoaderService';
import { p2pService } from '../services/p2pService';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  showFiller = false;
  opened: boolean = true;
  menu_status: string = 'side';
  default_responsive_size: number = 900; 
  hasBackdrop = false;
  move_btn =false;

  private readonly notifier: NotifierService;

  constructor(private snackBar: MatSnackBar, public auth : AuthService,public p2p: p2pService ,public customLoader: CustomLoaderService, notifierService: NotifierService) 
  { 
    this.notifier = notifierService;
  }


  ngOnInit() {

    //console.log(this.auth.getGLobalAdmin());
    if(window.innerWidth < this.default_responsive_size) { this.opened = false; this.menu_status = 'over';}
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
    //dafault  info success warning Whoops
  showNotif(type, message)
  {
    this.notifier.notify( type, message);
  }


  logout()
  {
    this.p2p.deletePeer().subscribe(
      data=> {
        if(data)
        {
          this.auth.logout("login");
          this.showNotif("default","good job");
          console.log("deleted");
          // close p2p connexion
          this.p2p.destroyPeer();
        }
        else
        {
          console.log("not exist");
        }
      },
      err => {
        console.log("deleting peer error ", err);
      }
      )
  }

  // check if the windows resized https://stackoverflow.com/questions/45350716/detect-window-size-using-angular-4
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth < this.default_responsive_size)
    {
      this.menu_status = 'over';
      this.opened = false;
    }else 
    {
      this.menu_status = 'side';
      this.opened = true;
      this.toogle_hasBackDrop_false();
    }
  }

  close_if_over()
  {
    if(this.menu_status=='over')
    {
      this.opened = false;
      this.toogle_hasBackDrop_false();
    }
  }

  toogle_hasBackDrop_true()
  { 
    if(this.menu_status=='over') this.hasBackdrop = true;
  }
  toogle_hasBackDrop_false()
  { 
    this.hasBackdrop = false;
  }

  movebtn()
  {
    this.move_btn = !this.move_btn;
  }
}
