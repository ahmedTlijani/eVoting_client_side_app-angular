import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthGuardService } from 'src/app/services/AuthGuardService';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { VoterCameraComponent } from '../voter-camera/voter-camera.component';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { PeopleModel } from 'src/app/models/PeopleModel';
import { CustomLoaderService } from 'src/app/services/customLoaderService';

@Component({
  selector: 'app-voter-inscription',
  templateUrl: './voter-inscription.component.html',
  styleUrls: ['./voter-inscription.component.scss']
})
export class VoterInscriptionComponent implements OnInit {

  hide = true;
  cin  = "";
  date_naissance: Date;
  user_role_=  "voter";
  voter_image_captred = ""; 
  cin_error = "" ;

  inscription_bureau_id = '';
  states =[];
  provinces =[];
  code_postal ="";
  province="";
  state="";
  adresse_id_: number;

   private readonly notifier: NotifierService;


  private authForm:FormGroup;

  constructor(public customLoader: CustomLoaderService, private voterService: SpringAPiService , public authGuard: AuthGuardService,public dialog: MatDialog, private auth : AuthService, private route: Router, private formBuilder: FormBuilder,notifierService: NotifierService) { 
      this.notifier = notifierService;
    }

  ngOnInit() {
    this.getState(); // get states

    this.authForm=this.formBuilder.group({
      cin:['', Validators.required],
      date_naissance:['', Validators.required],
      state:['', Validators.required],
      province:['', Validators.required],
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
          this.voterService.getOnePeopleByCinDate(peopple).subscribe(
            data => {
               this.customLoader.setShowLoaderStatut(false); // stop the loader 
              if(data)
              {
                //console.log(data);
                if(data.status=="OK") // cin et date de naissance existe est compatible est n'es pas inscrit
                {
                  console.log(data.status);
                  // give the voting office id here -- update 31-05-2019
                  // user datasharing service 
                  this.auth.setInscriptionBureau(this.state,this.province);
                  console.log("setting infomation");
                  console.log(this.auth.getInscriptionBureau());
                  this.openDialog(data);
                }
                else if(data.status=="FAIL-age")
                {
                  console.log(data.status);
                  this.showNotif("warning","Vous n'avez pas le droit pour inscrire, Min age 18");
                }
                else if(data.status=="FAIL-date")
                {
                  this.showNotif("default","Veuillez verifier votre date de naissance.");
                } 

                else if(data.status=="FAIL-inscrit")
                {
                  this.showNotif("default","Vous êtes déjà inscrit ");
                }  
                else
                {
                  console.log(true);
                }

              }
              else
              {
                console.log("Electeur not found");
                this.showNotif("warning","Veuillez vérifier vos informations!");
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

   n(n){ return n > 9 ? "" + n: "0" + n; }


    openDialog(personne: PeopleModel): void {
      const dialogRef = this.dialog.open(VoterCameraComponent, {
         data: {
           data: personne,
           action_type: "inscription"
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



    getState()
  {
    this.voterService.getAllAdresseDataSet().subscribe(
      data => {
          console.log(data);
           //for (let i=0; i<data.length;i++){this.states = this.getOnlyState(data);}
           this.states = this.getOnlyState(data);
           console.log("---------------");
           console.log(this.states);
       }, 
       err => {
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
  }

  getOnlyState(adresses)
  {
    this.states=[];
    var x =[];
    var a = adresses[0].state;
    x.push(a);

    for(let i=1;i<adresses.length;i++)
    {
      if(adresses[i].state!=a)
      {
        x.push(adresses[i].state);
        a = adresses[i].state;
      }
    }
    return x;
  }

  loadProvince(state)
  {
    // get province list based on state
    console.log(state);
    this.provinces=[];
    this.voterService.getProvincesByState(state).subscribe(
      data => {
            console.log(data);
           for (let i=0; i<data.length;i++){

              this.provinces.push(data[i].province);
           }
           console.log('-------------------------');
           console.log(this.provinces);
       }, 
       err => {
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
       
  }

  getAdresseById(id)
  {
    this.voterService.getOneAdresse(id).subscribe(
      data => {
            this.state = data.state;
            this.province = data.province;
       }, 
       err => {
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
  }

  getCodePostal()
  {
    let state = this.authForm.value.state;
    let province = this.authForm.value.province;
    console.log(state, province);
    this.voterService.getAdresseId(state,province).subscribe(
      data => {
            console.log(data);
            this.code_postal = data.code_postal;
            this.adresse_id_ = data.adresse_id;
       }, 
       err => {
       this.showNotif("warning", "Connection error! " )
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  

  }
 
  getCodePostalBystate(s,p)
  {
    let state = s;
    let province = p;
    console.log(state, province);
    this.voterService.getAdresseId(state,province).subscribe(
      data => {
            console.log(data);
            this.code_postal = data.code_postal;
            this.adresse_id_ = data.adresse_id;
       }, 
       err => {
       this.showNotif("warning", "Connection error! " )
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  

  }


    
}
