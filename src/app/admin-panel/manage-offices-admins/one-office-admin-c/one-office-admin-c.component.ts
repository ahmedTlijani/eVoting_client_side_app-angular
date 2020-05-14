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
import { ResponsableDeBureau } from 'src/app/models/ResponsableDeBureau';

@Component({
  selector: 'app-one-office-admin-c',
  templateUrl: './one-office-admin-c.component.html',
  styleUrls: ['./one-office-admin-c.component.scss']
})
export class OneOfficeAdminCComponent implements OnInit {

  element:any ; 
  elementData: ResponsableDeBureau = new ResponsableDeBureau();

  sentResult = {
      statut : false
  }
  cin_error = "" ;

  states =[];
  provinces =[];
  bureaux: BureauElection[] =[];
  code_postal ="";
  province="";
  state="";
  bureau_id: number; // id
  adresse_id_: number;
  date_naissance = new FormControl();

  private responsableForm:FormGroup;
  private readonly notifier: NotifierService;

  image_upladed_: boolean = false;
  image_src_: string ='';
  selected_image_: any;

//https://kzrfaisal.github.io/#/afu
//https://github.com/kzrfaisal/angular-file-uploader#for-versions--5x-


  constructor(public customLoader: CustomLoaderService ,public dialogRef: MatDialogRef<OneOfficeAdminCComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private responsableBureauService : SpringAPiService, private uplaodSerivce : UplaodService, notifierService: NotifierService){
      this.notifier = notifierService;
      console.log(this.data);
     }

    
 
  ngOnInit() {

    this.element = this.data;
    this.getState(); // get states
    this.getBureauDelection(); // get all bureau d'élection

    // this.getAdresseById(this.data.adresse_id);

    if(this.element.type=="Update")
    {
      this.elementData = this.element.data as ResponsableDeBureau;
    }
    //console.log("from dialog box ")  
    console.log(this.element);

    this.responsableForm=this.formBuilder.group({
      name:['', Validators.required],
      surname:['', Validators.required],
      date_naissance:['', Validators.required],
      gender:['', Validators.required],
      bureau:['', Validators.required],
      state:['', Validators.required],
      province:['', Validators.required],
      cin:['', Validators.required],
      username:['', Validators.required],
      password:['', Validators.required],
     });

    // test if update or add 
    if(this.element.type != "Add")
    {
      this.state = this.element.data.adresse.state;
      this.loadProvince(this.state);
      this.province = this.element.data.adresse.province;
      console.log(this.state, this.province);
      this.getCodePostalBystate(this.state,this.province);
      var d= this.element.data.date_naissance;
      console.log("----------------",d);
      this.date_naissance = new FormControl(new Date(''+d+''));
      this.image_src_ = this.element.data.image;

      this.bureau_id = this.element.data.bureau.office_id;


    }

  }

  getState()
  {
    this.responsableBureauService.getAllAdresseDataSet().subscribe(
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
    this.responsableBureauService.getProvincesByState(state).subscribe(
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
    this.responsableBureauService.getOneAdresse(id).subscribe(
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
    let state = this.responsableForm.value.state;
    let province = this.responsableForm.value.province;
    console.log(state, province);
    this.responsableBureauService.getAdresseId(state,province).subscribe(
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
    this.responsableBureauService.getAdresseId(state,province).subscribe(
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


  getBureauDelection()
  {
    this.responsableBureauService.getAllVotingOffices().subscribe(
      data => {
          console.log(data);
           this.bureaux = data;
       }, 
       err => {
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
  }

  setBureauId(bureau)
  {
    this.bureau_id = bureau.office_id;
  }


  onNoClick(): void {
    //this.hideAllNotifications();
    this.dialogRef.close(this.sentResult);
  }


  AddUpdateElement()
  {
    //console.log("update ok "); // call the update service here
 
      // console.log(this.responsableForm)
       if(this.element.type == "Add")
        {
          if(this.responsableForm.valid)
          {
            if( this.responsableForm.value.cin.length !=8)
            {
              this.showNotif("warning","Cin must be 8 caracteres");
              return;
            }

            if(!this.image_upladed_)
            {
              this.showNotif("warning","You must upload this image first!");
              return;
            }


            let tempratyModel: ResponsableDeBureau = new ResponsableDeBureau();

            console.log("valid form adding");
            tempratyModel.name = this.responsableForm.value.name;
            tempratyModel.surname = this.responsableForm.value.surname;
            tempratyModel.date_naissance = this.responsableForm.value.date_naissance;
            tempratyModel.gender = this.responsableForm.value.gender;
            tempratyModel.cin = this.responsableForm.value.cin;
            tempratyModel.adresse_id= this.adresse_id_;
            tempratyModel.image = this.image_src_;
            tempratyModel.bureau_id = this.bureau_id;
            tempratyModel.username = this.responsableForm.value.username;
            tempratyModel.password = this.responsableForm.value.password;

            console.log(tempratyModel);

            // send the request by calling the mthode
            this.customLoader.setShowLoaderStatut(true); // run the loader 

           this.responsableBureauService.addOneResponsabelBureau(tempratyModel).subscribe(
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

                  console.log('update HTTP Error',err);
                  this.showNotif("warning","Connection error!");
                  },
                  () => {
                    this.customLoader.setShowLoaderStatut(false); // stop the loader 
                    console.log('update HTTP request completed.');
                  })

            
          }else
          {
            console.log("not valid adding")
            this.showNotif("warning","you need to enter some informations first!")
          }
        }
        else 
        {
          if(this.responsableForm.touched)
          {
            if( this.responsableForm.value.cin.length !=8)
            {
              this.showNotif("warning","Cin must be 8 caracteres");
              return;
            }

            if(!this.image_upladed_ && this.image_src_.length==0)
            {
              this.showNotif("warning","You must pick an image!");
              return;
            }

            let tempratyModel: ResponsableDeBureau = new ResponsableDeBureau();

            console.log("valid form updating");
            tempratyModel.id_responsable = this.elementData.id_responsable;
            tempratyModel.name = this.elementData.name;
            tempratyModel.surname = this.elementData.surname;
            tempratyModel.date_naissance = this.elementData.date_naissance;
            tempratyModel.gender = this.elementData.gender;
            tempratyModel.cin = this.elementData.cin;
            tempratyModel.adresse_id= this.adresse_id_;

            tempratyModel.username = this.elementData.username;
            tempratyModel.password = this.elementData.password;

            tempratyModel.bureau_id = this.bureau_id;

            tempratyModel.image = this.image_src_;
            console.log(tempratyModel);
            
            this.customLoader.setShowLoaderStatut(true); // run the loader 
            this.responsableBureauService.updateOneResponsabelBureau(tempratyModel).subscribe(
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

  //https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/#select-a-file
    onFileChanged(event){
      this.selected_image_ = event.target.files[0];
      this.image_upladed_ = false;
      this.image_src_ = '';
    }

    uplaod() {
      //console.log("uplaoding...");
      if(this.validateFile(this.selected_image_.name) && this.selected_image_.type.match(/image\/*/))
      {
        this.customLoader.setShowLoaderStatut(true);
        //console.log(this.selected_image_);
        var reader = new FileReader();
        reader.readAsDataURL(this.selected_image_);
        reader.onload = () => {
          var base64image = reader.result.toString().split(',')[1];
          console.log(base64image);
          var cin = this.responsableForm.value.cin;
          var n = cin + Math.floor((Math.random() * 99999) + 1000); // Return a random number between 1000 and 99999:
          if(!this.responsableForm.valid && this.element.type=="Add"){this.customLoader.setShowLoaderStatut(false);this.showNotif("default","You need to Enter You informations first!");return;}
          this.uplaodSerivce.uplaodImage(n,base64image).subscribe(
                  data => {
                    this.showNotif("success","Uplaod wit success");
                    this.image_upladed_ = true;
                    this.image_src_ = data.url; // change this to data
                    this.customLoader.setShowLoaderStatut(false); // stop the loader 
                    console.log(data);
                         }, 
                  err => {
                    this.customLoader.setShowLoaderStatut(false); // stop the loader 
                    this.showNotif("warning","Connection error!");
                    console.log('update HTTP Error',err);
                  })             
              }; // end reader onload

      }
      else
      {
        this.showNotif("default","Only Images Are Allowed With Extensions : ['jpeg', 'jpg']");
      }
    }

     validateFile(name) 
        {
            var allowedExtension = ['jpeg', 'jpg'];
            var fileExtension = name.split('.').pop().toLowerCase();
            var isValidFile = false;
                for(var index in allowedExtension) {

                    if(fileExtension === allowedExtension[index]) {
                        isValidFile = true; 
                        break;
                    }
                }
            return isValidFile;
        }


}/*
*/