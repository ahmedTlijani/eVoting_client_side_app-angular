import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from '../services/AuthGuardService'
import { AuthService } from '../services/AuthService';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Admin } from '../models/Admin';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from '../services/customLoaderService';
import { ResponsableDeBureau } from '../models/ResponsableDeBureau';
import { p2pService } from '../services/p2pService';


@Component({
  selector: 'app-authentification-page',
  templateUrl: './authentification-page.component.html',
  styleUrls: ['./authentification-page.component.scss']
})
export class AuthentificationPageComponent implements OnInit {
  hide = true;
  username  = "";
  password  = "";
  user_role = "";
  officeAdmin_ = "office-admin";
  admin_=  "admin";
  
  private readonly notifier: NotifierService;

  private authForm:FormGroup;

  constructor(public p2p: p2pService ,public customLoader: CustomLoaderService, notifierService: NotifierService ,public authGuard: AuthGuardService, private auth : AuthService, private route: Router, private formBuilder: FormBuilder) { 
    this.notifier = notifierService; 
  }

  ngOnInit() {
    this.authForm=this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required],
      role:['', Validators.required],
     });


   }


    login() // using username , password and type of the user 
    {
      console.log("loging....");

      this.customLoader.setShowLoaderStatut(true); // run the loader 

      if (this.authForm.dirty && this.authForm.valid) {
        this.username = this.authForm.value.username;
        this.password  = this.authForm.value.password
        this.user_role = this.authForm.value.role;

        // if the user exist set userToke and userRole
        // we defined the userToke and the userRole
     
          if(this.user_role == this.officeAdmin_)
          {
            var resp_connected: ResponsableDeBureau = new ResponsableDeBureau;
            resp_connected.username = this.username;
            resp_connected.password = this.password;
            //console.log(resp_connected);

            this.auth.responsableAuthentification(resp_connected).subscribe(
              data => {
                //console.log(data);
                this.customLoader.setShowLoaderStatut(false); // stop the loader 
                if(data!=null)
                {
                  this.auth.setGlobalResposable(data);
                  this.auth.setTokens(data.id_responsable,this.user_role);
                  //console.log("office-admin");
                  // create new peer 
                  this.p2p._ini_(); // open peer to peer connexion

                  this.route.navigate(["office-admin-panel"]);
                }
                else{
                  this.showNotif("warning","Check You information then try again!");
                }
              },
              err => {
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                this.showNotif("warning","Connexion error!");
                console.log('Authentifcation HTTP Error',err);
              }  
            )

          }
          else if (this.user_role == this.admin_) { // super admin
            
            var admin_connected: Admin = new Admin;
            admin_connected.username = this.username;
            admin_connected.password = this.password;
            //console.log(admin_connected);
            // send request 
            this.auth.adminAuthentification(admin_connected).subscribe(
              data => {
                this.customLoader.setShowLoaderStatut(false); // stop the loader 
                if(data!=null)
                {
                  //this.auth.setGlobalAdmin(data);
                  //console.log(data.admin_id);
                  this.auth.setTokens(data.admin_id,this.user_role);
                  //console.log("admin");
                  // create new peer 
                  this.p2p._ini_(); // open peer to peer connexion                 
                  this.route.navigate(["admin-panel"]);
                }
                else {
                  this.showNotif("warning","Check You information then try again!");
                }
                
              },
              err => {
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                this.showNotif("warning","Connexion error!");
                console.log('Authentifcation HTTP Error',err);
              }  
            )


            
          }

       
      }
    }
 
    //dafault  info success warning Whoops
  showNotif(type, message)
  {
    this.notifier.notify( type, message);
  }


  testGetAllAdmins()
  {
    this.auth.getAllAdmins().subscribe(
      data => 
      {  
        console.log(data);
      },
      err =>
      {
        console.log(err);
      }
      )
  }



}
