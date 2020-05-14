import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PeopleModel } from 'src/app/models/PeopleModel';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { Adresse } from 'src/app/models/Adresse';

@Component({
  selector: 'app-one-adresse-entry-c',
  templateUrl: './one-adresse-entry-c.component.html',
  styleUrls: ['./one-adresse-entry-c.component.scss']
})
export class OneAdresseEntryCComponent implements OnInit {
  
    element:any ; 
    elementData: Adresse = new Adresse();
  
    sentResult = {
        statut : false
    }
    code_postal_error = "" ;
    //https://www.npmjs.com/package/angular-notifier
  
  
    private adresseForm:FormGroup;
    private readonly notifier: NotifierService;
  
    constructor(public customLoader: CustomLoaderService ,public dialogRef: MatDialogRef<OneAdresseEntryCComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private adresseDataSetSerivce : SpringAPiService,notifierService: NotifierService){
        this.notifier = notifierService;
  
       }
  
      
   
    ngOnInit() {
  
      this.element = this.data;
      if(this.element.type=="Update")
      {
        this.elementData = this.element.data as Adresse;
      }
      //console.log("from dialog box ")  
      console.log(this.element);
  
      this.adresseForm=this.formBuilder.group({
        state:['', Validators.required],
        province:['', Validators.required],
        code_postal:['', Validators.required],
       });
  
  
    }
  
    onNoClick(): void {
      //this.hideAllNotifications();
      this.dialogRef.close(this.sentResult);
    }
  
  
    AddUpdateElement()
    {
      //console.log("update ok "); // call the update service here
   
        // console.log(this.peopleForm)
         if(this.element.type == "Add")
          {
            if(this.adresseForm.valid)
            {
              
              let tempratyModel: Adresse = new Adresse();
  
              console.log("valid form adding");
              tempratyModel.state = this.adresseForm.value.state;
              tempratyModel.province = this.adresseForm.value.province;
              tempratyModel.code_postal = this.adresseForm.value.code_postal;
              console.log(tempratyModel);
  
              // send the request by calling the mthode
              this.customLoader.setShowLoaderStatut(true); // run the loader 
  
             this.adresseDataSetSerivce.addOneAdresse(tempratyModel).subscribe(
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
            if(this.adresseForm.touched)
            {
              let tempratyModel: Adresse = new Adresse();
  
              console.log("valid form updating");
              tempratyModel.adresse_id = this.elementData.adresse_id;
              tempratyModel.state = this.elementData.state;
              tempratyModel.province = this.elementData.province;
              tempratyModel.code_postal = this.elementData.code_postal;
              console.log(tempratyModel);
              
              this.customLoader.setShowLoaderStatut(true); // run the loader 
              this.adresseDataSetSerivce.updateOneAdressePeopleDataSet(tempratyModel).subscribe(
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
          this.code_postal_error = "Code postal is only numbers"; 
          return false;
        }else
        {
          this.code_postal_error = ""; 
          return true;
        } 
    
      }

   
  }/*
  */