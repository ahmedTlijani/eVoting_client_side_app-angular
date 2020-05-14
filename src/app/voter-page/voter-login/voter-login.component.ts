import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthGuardService } from 'src/app/services/AuthGuardService';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { VoterCameraComponent } from '../voter-camera/voter-camera.component';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { PeopleModel } from 'src/app/models/PeopleModel';
import { Electeur } from 'src/app/models/Electeur';

import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { Block } from 'src/app/models/blockchain/block';
import { BlockData } from 'src/app/models/blockchain/BlockData';
import { ChainData } from 'src/app/models/blockchain/ChainData';
import { p2pService } from 'src/app/services/p2pService';


@Component({
  selector: 'app-voter-login',
  templateUrl: './voter-login.component.html',
  styleUrls: ['./voter-login.component.scss']
})
export class VoterLoginComponent implements OnInit {

  hide = true;
  cin  = "";
  date_naissance : Date;
  user_role_=  "voter";
  voter_image_captred = ""; // https://www.npmjs.com/package/ngx-webcam
  cin_error = "" ;
   private readonly notifier: NotifierService;


  private authForm:FormGroup;

  constructor(public p2p: p2pService ,public customLoader: CustomLoaderService, private voterService: SpringAPiService ,public authGuard: AuthGuardService,public dialog: MatDialog, private auth : AuthService, private route: Router, private formBuilder: FormBuilder,notifierService: NotifierService) { 
      this.notifier = notifierService;
    }

  ngOnInit() {
    this.authForm=this.formBuilder.group({
      cin:['', Validators.required],
      date_naissance:['', Validators.required],
      });

   }

    login() // using username , password and type of the user 
    {
      console.log("loging....");

      if (this.authForm.dirty && this.authForm.valid) {
        this.cin = this.authForm.value.cin;
        this.date_naissance = this.authForm.value.date_naissance;
        
        if(this.cin.length==8) // && user exist in  peopleDataSet table
        {

          this.customLoader.setShowLoaderStatut(true); // run the loader 
          // crate new peopleModel sned it to server
          let peopple : PeopleModel = new PeopleModel;
          peopple.cin = this.cin;
          peopple.date_naissance = this.date_naissance;
          //console.log(peopple);

          this.voterService.getOneElecteurByCinData(peopple).subscribe(
            data => {
              //console.log(data);
              if(data)//
              {
                if(data.status) // existe 
                {
                  // check if the user didnt vote already 
                  // create new peer 
                  this.p2p._ini_(); // open peer to peer connexion
                  setTimeout(()=>{
                    var temp_block = new ChainData();
                    temp_block.setchainBlocks(this.p2p.chain.getchainBlocks());
                    console.log("temp block from login",temp_block);
                    this.customLoader.setShowLoaderStatut(false); // stop the loader 
                    //console.log('one ', temp_block.getchainBlocks()[0].data.publicHash);
                    var verif = false;
                    for(var i=0;i<temp_block.getchainBlocks().length;i++)
                    {
                      if(temp_block.getchainBlocks()[i].data.publicHash == data.data.hash_code)
                      {
                        verif = true; // voted
                        break;
                      }
                    }
                    if(verif)
                    {
                      console.log("you already voted");
                      this.showNotif("warning","You already voted on this poll");
                      //alert("You already voted on this poll");
                      // open result page 
                      this.auth.setTokens(data.data.hash_code,"voter");
                      setTimeout(()=>{
                        this.route.navigate(["results"]);
                      },1000);
                    }
                    else
                    {
                      console.log("open dialog to confirm");
                      this.openDialog(data);
                    }
                  },2000);
                  
                }
                else
                { // date de naissance et incorrect
                  this.customLoader.setShowLoaderStatut(false); // stop the loader 
                  console.log("Veuillez verifier votre date de naissance");
                  this.showNotif("default","Veuillez verifier votre date de naissance!");
                }
                   
              }
              else
              {
                this.customLoader.setShowLoaderStatut(false); // stop the loader 
                console.log("Vous n'êtes pas inscrit");
                this.showNotif("warning","Vous n'êtes pas inscrit!");
              }   
                 
            },
            err => {
              this.customLoader.setShowLoaderStatut(false); // stop the loader 
              console.log("Http Error", err);
              this.showNotif("warning","Connexion Error!");
            }
          )
        }
       else
       {
         this.showNotif("error","Cin must be 8 caractere length" );
       }

        // open dialog box to recieve the image scr 
        
        /*
        if(true) // send request 
        {
          this.auth.setTokens(this.user_role_);
          if(localStorage.getItem('userRole') == this.user_role_) 
          { console.log("voter"); this.route.navigate(["voter-panel"]); }
        }
        */

      }



    }

    openDialog(electeur: Electeur): void {
      const dialogRef = this.dialog.open(VoterCameraComponent, {
         data: {
           data: electeur,
           action_type: "login"
         },
         panelClass: 'camera-dialog-container' 
      });
  
      dialogRef.afterClosed().subscribe(result => {
       // console.log('The dialog was closed');
       console.log(result);
      });
    }

    
    
      //dafault  info success warning Whoops
    showNotif(type, message)
    {
      this.notifier.notify( type, message);
    }
  
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        this.cin_error = "Cin is only numbers"; 
        return false;
      }else
      {
        this.cin_error = ""; 
        return true;
      } 
  
    }


    logout()
    {
      this.p2p.deletePeer().subscribe(
        data=> {
          if(data)
          {
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

}
