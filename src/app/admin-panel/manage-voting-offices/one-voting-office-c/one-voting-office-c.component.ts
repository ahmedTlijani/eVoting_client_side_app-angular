import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PeopleModel } from 'src/app/models/PeopleModel';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { Adresse } from 'src/app/models/Adresse';
import {FormControl} from '@angular/forms';
import { UplaodService } from 'src/app/services/UploadService';
import { BureauElection } from 'src/app/models/BureauElection';
import { Admin } from 'src/app/models/Admin';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-one-voting-office-c',
  templateUrl: './one-voting-office-c.component.html',
  styleUrls: ['./one-voting-office-c.component.scss']
})
export class OneVotingOfficeCComponent implements OnInit {

  element:any ; 
  elementData: BureauElection = new BureauElection();

  sentResult = {
      statut : false
  }

  states =[];
  provinces =[];
  code_postal ="";
  province="";
  state="";
  adresse_id_: number;

  private votingForm:FormGroup;
  private readonly notifier: NotifierService;

  constructor(public customLoader: CustomLoaderService ,public dialogRef: MatDialogRef<OneVotingOfficeCComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private bureauElectionSerivce : SpringAPiService, private auth: AuthService, notifierService: NotifierService){
      this.notifier = notifierService;
      console.log(this.data);
     }

    
 
  ngOnInit() {

    this.element = this.data;
    this.getState(); // get states

    // this.getAdresseById(this.data.adresse);

    if(this.element.type=="Update")
    {
      this.elementData = this.element.data as BureauElection;
    }
    //console.log("from dialog box ")  
    console.log(this.element);

    this.votingForm=this.formBuilder.group({
      name:['', Validators.required],
      state:['', Validators.required],
      province:['', Validators.required],
      maxNumber:['', Validators.required],
     });

    // test if update or add 
    if(this.element.type != "Add")
    {
      this.state = this.element.data.adresse.state;
      this.loadProvince(this.state);
      this.province = this.element.data.adresse.province;
      console.log(this.state, this.province);
      this.getCodePostalBystate(this.state,this.province);
    }

  }

  getState()
  {
    this.bureauElectionSerivce.getAllAdresseDataSet().subscribe(
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
    this.bureauElectionSerivce.getProvincesByState(state).subscribe(
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
    this.bureauElectionSerivce.getOneAdresse(id).subscribe(
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
    let state = this.votingForm.value.state;
    let province = this.votingForm.value.province;
    console.log(state, province);
    this.bureauElectionSerivce.getAdresseId(state,province).subscribe(
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
    this.bureauElectionSerivce.getAdresseId(state,province).subscribe(
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


  onNoClick(): void {
    //this.hideAllNotifications();
    this.dialogRef.close(this.sentResult);
  }


  AddUpdateElement()
  {
    //console.log("update ok "); // call the update service here
 
      // console.log(this.votingForm)
       if(this.element.type == "Add")
        {
          if(this.votingForm.valid)
          {
            
            let tempratyModel: BureauElection = new BureauElection();
            tempratyModel.adresse_id = this.adresse_id_;

            console.log("valid form adding");
            tempratyModel.name = this.votingForm.value.name;
            tempratyModel.max_number_voter = this.votingForm.value.maxNumber;
            // get admin connected id
            let id = this.auth.getIdToken();
            //console.log(admin);
            tempratyModel.admin_id = parseInt(id);
            console.log(tempratyModel);

            // send the request by calling the mthode
            this.customLoader.setShowLoaderStatut(true); // run the loader 
         
           this.bureauElectionSerivce.addOneVotingOffice(tempratyModel).subscribe(
              data => {
                this.customLoader.setShowLoaderStatut(false); // stop the loader 

                      if(data) // true
                      {
                        console.log(data);
                        this.sentResult.statut = true;
                        this.onNoClick();
                      }
                      else{this.showNotif("warning","Somthing went wrong! please try again")}
                     }, 
                  err => {
                    this.customLoader.setShowLoaderStatut(false); // stop the loader 

                  console.log('add HTTP Error',err);
                  this.showNotif("warning","Connection error!");
                  },
                  () => {
                    this.customLoader.setShowLoaderStatut(false); // stop the loader 
                    console.log('add HTTP request completed.');
                  })

            
          }else
          {
            console.log("not valid adding")
            this.showNotif("warning","you need to enter some informations first!")
          }
        }
        else 
        {
          if(this.votingForm.touched)
          {
            
            let tempratyModel: BureauElection = new BureauElection();

            console.log("valid form updating");
            tempratyModel.name = this.elementData.name;
            tempratyModel.adresse_id = this.adresse_id_;
            tempratyModel.max_number_voter = this.votingForm.value.maxNumber;
            let id = this.auth.getIdToken();
            //console.log(admin);
            tempratyModel.admin_id = parseInt(id); 
            tempratyModel.creation_date = this.elementData.creation_date;
            tempratyModel.office_id = this.elementData.office_id;

            console.log(tempratyModel);
            
            this.customLoader.setShowLoaderStatut(true); // run the loader 
            this.bureauElectionSerivce.updateOneVotingOffice(tempratyModel).subscribe(
              data => {
                this.customLoader.setShowLoaderStatut(false); // stop the loader 

                    if(data) // true
                            {
                              console.log(data);
                              this.sentResult.statut = true;
                              this.onNoClick();
                            }
                            else{this.showNotif("warning","Somthing went wrong! please try again")}
                     }, 
                      err => {
                        this.customLoader.setShowLoaderStatut(false); // stop the loader 

                        this.showNotif("warning","Connection error!");
                      console.log('update HTTP Error',err);
                      },
                      () => {
                        this.customLoader.setShowLoaderStatut(false); // stop the loader 
                        console.log('update HTTP request completed.')
                      })

          }else
          {
            console.log("not valid updating")
            this.showNotif("warning", "you need to make changes first!")
          }
        }

       
    }
    
  //dafault  info success warning Whoops
  showNotif(type, message)
    {
      this.notifier.notify( type, message);
    }

   hideAllNotifications(): void {
      this.notifier.hideAll();
    }
 
     
}