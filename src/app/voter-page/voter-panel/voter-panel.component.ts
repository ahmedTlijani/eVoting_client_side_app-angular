import { Component, OnInit } from '@angular/core';
import { Parti } from 'src/app/models/Parti';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { Electeur } from 'src/app/models/Electeur';
import { ChainData } from 'src/app/models/blockchain/ChainData';
import { BlockData } from 'src/app/models/blockchain/BlockData';
import { Block } from 'src/app/models/blockchain/block';
import { p2pService } from 'src/app/services/p2pService';
import { MatDialog } from '@angular/material';
import { VoterCameraComponent } from '../voter-camera/voter-camera.component';

@Component({
  selector: 'app-voter-panel',
  templateUrl: './voter-panel.component.html',
  styleUrls: ['./voter-panel.component.scss']
})
export class VoterPanelComponent implements OnInit {

  private readonly notifier: NotifierService;

  deadline = 'November 24 2019 00:00:00 GMT+0200';
  tooltip_information: string ='ahmed'; 
  parti_information: string ='';
  parties_test: Parti[] = [
    {parti_id: 1, name: 'Parti 1', type:'solo', admin_id: 1, adresse_id: 1 , image:'https://upload.wikimedia.org/wikipedia/fr/f/f9/Logo-radio-tunisienne-640x405.png'},
    {parti_id: 2, name: 'Parti 2', type:'no solo', admin_id: 1, adresse_id: 2 , image:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Logo_T%C3%A9l%C3%A9vision_tunisienne_1%2C_2017.svg/1200px-Logo_T%C3%A9l%C3%A9vision_tunisienne_1%2C_2017.svg.png'},
    {parti_id: 3, name: 'Parti 3', type:'solo 2', admin_id: 1, adresse_id: 3 , image:'https://ween.tn/uploads/image/28209/28207/avatar/avatar.png'},
    {parti_id: 1, name: 'Parti 1', type:'solo 3', admin_id: 1, adresse_id: 1 , image:'https://upload.wikimedia.org/wikipedia/fr/f/f9/Logo-radio-tunisienne-640x405.png'},

  ];

  parties: Parti[];

  selectedEntry: Parti;

  isLoading = true; // spinner loading
  electeur: Electeur;

  data_chain = {
    type: null, // block or blockchain
    data: null // block or blockchain
  }

  constructor(public p2p: p2pService ,public dialog: MatDialog, public customLoader: CustomLoaderService , private auth : AuthService, private route: Router,notifierService: NotifierService, public voter_panel: SpringAPiService) 
  { 
    //this.parties = this.parties_test;
    this.notifier = notifierService;

    if(this.auth.getElecteur())
    {
      this.electeur = this.auth.getElecteur();
      this.showNotif("default","Successfully connected");
      console.log("------------ Electeur -----------");
      console.log(this.electeur);
    }else
    {
      this.showNotif("warning","Something went wrong");
    }


  }

  ngOnInit() {
    this.setDate();
    this.getList();

  }

  getList()
  {  
    
    this.voter_panel.getAllParti().subscribe(
      data => {
          console.log(data);
          this.isLoading = false;
          this.parties = data as Parti[];
       }, 
       err => {
        this.showNotif("warning", "Connection error! " )
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
}

  onSelectionChange(entry) {
    this.selectedEntry = entry;
    console.log(entry);
  }

  reset_info(party)
  {
    this.parti_information = 'Type: ' + party.type;
  }


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
  // countdown functions
  setDate()
  {
    setTimeout(()=>{
      let a = this.getTimeRemaining(this.deadline);
      //console.log(a.total);
      this.tooltip_information ='Days left: ' + a.days +', Hours left: '+ a.hours +', Minutes left: '+ a.minutes +', Seconds left: '+ a.seconds;
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


voter()
{

  if(this.selectedEntry && this.electeur)
  {

  this.openDialog();
 
  }
  else
  {
    this.showNotif("default","You need to vote for someone!");
  }

}


openDialog(): void {
  const dialogRef = this.dialog.open(VoterCameraComponent, {
     data: {
       electeur: this.electeur,
       voted_to: this.selectedEntry,
       action_type: "voter"
     },
     panelClass: 'camera-dialog-container' 
  });

  dialogRef.afterClosed().subscribe(result => {
   // console.log('The dialog was closed');
   console.log(result);
  });
}


}
