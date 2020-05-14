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
import { Parti } from 'src/app/models/Parti';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-one-parti-c',
  templateUrl: './one-parti-c.component.html',
  styleUrls: ['./one-parti-c.component.scss']
})
export class OnePartiCComponent implements OnInit {

  element:any ; 
  elementData: Parti = new Parti();

  sentResult = {
      statut : false
  }
  cin_error = "" ;

  states =[];
  provinces =[];
  code_postal ="";
  province="";
  state="";
  adresse_id_: number;

  private partiForm:FormGroup;
  private readonly notifier: NotifierService;

  image_upladed_: boolean = false;
  image_src_: string ='';
  selected_image_: any;

  constructor(public customLoader: CustomLoaderService ,public dialogRef: MatDialogRef<OnePartiCComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,private auth: AuthService, private partiService : SpringAPiService, private uplaodSerivce : UplaodService, notifierService: NotifierService){
      this.notifier = notifierService;
      console.log(this.data);
     }

    
 
  ngOnInit() {

    this.element = this.data;
    this.getState(); // get states

    // this.getAdresseById(this.data.adresse_id);

    if(this.element.type=="Update")
    {
      this.elementData = this.element.data as Parti;
    }
    //console.log("from dialog box ")  
    console.log(this.element);

    this.partiForm=this.formBuilder.group({
      name:['', Validators.required],
      type:['', Validators.required],
      state:['', Validators.required],
      province:['', Validators.required],
     });

    // test if update or add 
    if(this.element.type != "Add")
    {
      this.state = this.element.data.adresse.state;
      this.loadProvince(this.state);
      this.province = this.element.data.adresse.province;
      console.log(this.state, this.province);
      this.getCodePostalBystate(this.state,this.province);
      
      this.image_src_ = this.element.data.image;
    }

  }

  getState()
  {
    this.partiService.getAllAdresseDataSet().subscribe(
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
    this.partiService.getProvincesByState(state).subscribe(
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
    this.partiService.getOneAdresse(id).subscribe(
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
    let state = this.partiForm.value.state;
    let province = this.partiForm.value.province;
    console.log(state, province);
    this.partiService.getAdresseId(state,province).subscribe(
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
    this.partiService.getAdresseId(state,province).subscribe(
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
 
      // console.log(this.partiForm)
       if(this.element.type == "Add")
        {
          if(this.partiForm.valid)
          {
            
            if(!this.image_upladed_)
            {
              this.showNotif("warning","You must upload this image first!");
              return;
            }


            let tempratyModel: Parti = new Parti();

            console.log("valid form adding");
            tempratyModel.name = this.partiForm.value.name;
            tempratyModel.type = this.partiForm.value.type;
            tempratyModel.adresse_id= this.adresse_id_;
            tempratyModel.image = this.image_src_;
            let id = this.auth.getIdToken();
            //console.log(admin);
            tempratyModel.admin_id = parseInt(id);

            console.log(tempratyModel);

            // send the request by calling the mthode
            this.customLoader.setShowLoaderStatut(true); // run the loader 

           this.partiService.addOneParti(tempratyModel).subscribe(
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
          if(this.partiForm.touched)
          {
           
            if(!this.image_upladed_ && this.image_src_.length==0)
            {
              this.showNotif("warning","You must pick an image!");
              return;
            }

            let tempratyModel: Parti = new Parti();

            console.log("valid form updating");
            tempratyModel.parti_id = this.elementData.parti_id;
            tempratyModel.name = this.elementData.name;
            tempratyModel.type = this.elementData.type;
            tempratyModel.adresse_id= this.adresse_id_;
            let id = this.auth.getIdToken();
            //console.log(admin);
            tempratyModel.admin_id = parseInt(id);

            tempratyModel.image = this.image_src_;
            console.log(tempratyModel);
            
            this.customLoader.setShowLoaderStatut(true); // run the loader 
            this.partiService.updateOneParti(tempratyModel).subscribe(
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
          var name = this.partiForm.value.name;
          if(!this.partiForm.valid && this.element.type=="Add"){this.customLoader.setShowLoaderStatut(false);this.showNotif("default","You need to Enter You informations first!");return;}
          this.uplaodSerivce.uplaodImage(name,base64image).subscribe(
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