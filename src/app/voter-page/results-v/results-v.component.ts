import { Component, OnInit } from '@angular/core';
import { p2pService } from 'src/app/services/p2pService';
import { MatDialog } from '@angular/material';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { AuthService } from 'src/app/services/AuthService';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results-v',
  templateUrl: './results-v.component.html',
  styleUrls: ['./results-v.component.scss']
})
export class ResultsVComponent implements OnInit {

  private readonly notifier: NotifierService;

  deadline = 'November 14 2019 00:00:00 GMT+0200';

  days: any = '00';
  hours: any = '00';
  minutes: any = '00';
  seconds: any = '00';

  constructor(public p2p: p2pService ,public dialog: MatDialog, public customLoader: CustomLoaderService , private auth : AuthService, private route: Router,notifierService: NotifierService, public voter_panel: SpringAPiService) { 
    this.notifier = notifierService;

  }

  ngOnInit() {
    this.setDate();
  }

  setDate()
  {
    setTimeout(()=>{
      let a = this.getTimeRemaining(this.deadline);
      //console.log(a.total);
      this.days = a.days;
      this.hours = a.hours;
      this.minutes = a.minutes;
      this.seconds = a.seconds;
      this.setDate();
    },1000)
  }

  getTimeRemaining(endtime: string){
    let d = new Date();
    var t = Date.parse(endtime) - Date.parse(d.toString());
    //console.log(t);
    var seconds = this.n( Math.floor( (t/1000) % 60 ) );
    var minutes = this.n( Math.floor( (t/1000/60) % 60 ) );
    var hours = this.n( Math.floor( (t/(1000*60*60)) % 24 ) );
    var days = this.n( Math.floor( t/(1000*60*60*24) ) );
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}


n(n){ return n > 9 ? "" + n: "0" + n; }


logout()
{
  this.p2p.deletePeer().subscribe(
    data=> {
      if(data)
      {
        this.auth.logout("voter-login");
        this.showNotif("default","good job");
        console.log("deleted")
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

  //dafault  info success warning Whoops
  showNotif(type, message)
  {
    this.notifier.notify( type, message);
  }


}