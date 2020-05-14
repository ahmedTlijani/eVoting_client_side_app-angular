import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { FacialVerificationService } from 'src/app/services/FacialVerificationService';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { Electeur } from 'src/app/models/Electeur';
import { AuthService } from 'src/app/services/AuthService';
import { Parti } from 'src/app/models/Parti';
import { ChainData } from 'src/app/models/blockchain/ChainData';
import { p2pService } from 'src/app/services/p2pService';


@Component({
  selector: 'app-voter-camera',
  templateUrl: './voter-camera.component.html',
  styleUrls: ['./voter-camera.component.scss']
})
export class VoterCameraComponent implements OnInit {

  
  private readonly notifier: NotifierService;

  is_there_a_face: boolean = true;
  message_cam = "No Face Detected";
  delay_time:number = 0; // user need to wait 5 second till next try
  time_to_wait = 5;

  voted_to: Parti;

  data_chain = {
    type: null, // block or blockchain
    data: null // block or blockchain
  }

  voter_data = {
    personne: null,
    image_captured: "image"
  }
  action_type='';
  userRole = 'voter';
  // toggle webcam on/off
  public showWebcam = true;
  public deviceId: string;
  public errors: WebcamInitError[] = [];
  public multipleWebcamsAvailable = false;
   
  // latest snapshot
  public webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  
  constructor(public p2p: p2pService, public customLoader: CustomLoaderService , public dialogRef: MatDialogRef<VoterCameraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private auth : AuthService,  private route: Router,notifierService: NotifierService, public facialVerification: SpringAPiService) { 
      this.notifier = notifierService;
      //console.log(this.data);
      setTimeout(()=>{
          if(this.is_there_a_face)this.showNotif("info","Place you face to match the white square!");
      },1000);
            
      if(data.action_type!="voter")
      {
        this.voter_data.personne = data.data.data;
        this.action_type = data.action_type;
      }
      else
      {
        console.log(data);
        this.voter_data.personne = data.electeur;
        this.action_type = data.action_type;
        this.voted_to = data.voted_to;
        
      }
      

    }

  ngOnInit() {
    console.log(this.action_type);

  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public handleImage(webcamImage: WebcamImage): void {
    let base64_image = "";
    //console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    base64_image = this.webcamImage.imageAsDataUrl.slice(23); // slice 23 caractere from begining 
    this.voter_data.image_captured = base64_image;
    
    // fire function from service 
    //console.log(this.voter_data);

    // send the request by calling the mthode
    this.customLoader.setShowLoaderStatut(true); // run the loader 

    this.delay_time = this.time_to_wait;

    this.is_there_a_face = false;
    this.message_cam = "Please wait...";

    //this.showNotif("info","Place you face to match the white square!");
    //console.log(this.voter_data);
    
    /*
    * {status: "OK", message: "The two faces are equal"}
    * {status: 0, message: "I wasn't able to locate any faces in at least one of the images. Check the image files. Aborting..."}
    * {status: "FAIL", message: "The two faces are different"}
    */

    if(this.action_type=="inscription")
    {
      console.log("inscription...")
    this.facialVerification.verifierFace(this.voter_data).subscribe(
              data => { // true
                      
                      console.log(data); 
                      if(data.status=="OK") //the two faces are equal
                      { 
                        console.log("Exact match");
                        this.showNotif("success","Exact match");
                        // add electeur 
                        //console.log(this.voter_data);
                        // get state and province from sharing service Auth
                        let off = this.auth.getInscriptionBureau();
                        if(!off){console.log("err off");return;}
                        let s = off.state;
                        let p = off.province;
                        this.facialVerification.getAdresseId(s,p).subscribe(
                        data=>{         
                          console.log(data);
                              this.facialVerification.getOneVotingOfficeByAdresseId(data.adresse_id).subscribe(
                                  data => {
                                    console.log(data);
                                    var electeur: Electeur = new Electeur;
                                    electeur.cin = this.voter_data.personne.cin;
                                    electeur.person_information = this.voter_data.personne.id_personne_;
                                    electeur.office_id = data.office_id;

                                      this.facialVerification.addOneElecteur(electeur).subscribe(
                                        data => {
                                          this.customLoader.setShowLoaderStatut(false); // stop the loader
                                            console.log(data);
                                            // redirect to another page 
                                            console.log("redirect");
                                            this.onNoClick();
                                            this.route.navigate(["success-inscription"]);
                                        },
                                        err => {
                                          this.customLoader.setShowLoaderStatut(false); // stop the loader
                                            console.log("Http error ", err);
                                            this.showNotif("warning","Inscription Failed");
                                        })
                                  },err=>{
                                    this.customLoader.setShowLoaderStatut(false); // stop the loader
                                    console.log("Http error ", err);
                                    this.showNotif("warning","Connexion error");
                                  })

                              },err=>{
                                console.log("Http error ", err);
                                 this.showNotif("warning","Connexion error");
                              })

                      }
                      else if(data.status=="FAIL") //The two faces are different
                      {
                        this.customLoader.setShowLoaderStatut(false); // stop the loader
                        console.log("Incomplete match");
                        this.showNotif("warning","Incomplete match");
                      } 
                      else if(data.status==0) // I was't able to locate...
                      {
                        this.customLoader.setShowLoaderStatut(false); // stop the loader
                        console.log("No face detected! try again with a better position.");
                        this.showNotif("warning","No face detected! try again with a better position.");
                      }
                      this.allow_user_after_delay(this.delay_time);
                      }, 
              err => {
                      this.customLoader.setShowLoaderStatut(false); // stop the loader 
                      console.log('HTTP Error',err);
                      this.is_there_a_face = true;
                      this.message_cam = "No Face Detected";
                      this.allow_user_after_delay(this.delay_time);
                      this.showNotif("warning","Connexion error!");

                      },
              () => {
                     this.is_there_a_face = true;
                     this.message_cam = "No Face Detected";
                     this.customLoader.setShowLoaderStatut(false); // stop the loader 
                     console.log('HTTP request completed.');
                     }) // end verifyFace
  }
  else if(this.action_type=="login")
  {
    //console.log("loging...");
    //console.log(this.voter_data);
    this.facialVerification.verifierFace(this.voter_data).subscribe(
      data => { // true
              
              console.log(data); 
              if(data.status=="OK") //the two faces are equal
              { 
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                console.log("Exact match");
                this.showNotif("success","Exact match");
                this.onNoClick();
                this.auth.setTokens(data.id_electeur,this.userRole);
                this.auth.setElecteur(this.voter_data.personne);// set electeur 
                this.route.navigate(["voter-panel"]);
              }
              else if(data.status=="FAIL") //The two faces are different
              {
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                console.log("Incomplete match");
                this.showNotif("warning","Wrong face detected");
                //this.onNoClick();
                this.is_there_a_face = true;
              } 
              else if(data.status==0) // I was't able to locate...
              {
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                console.log("No face detected! try again with a better position.");
                this.showNotif("warning","No face detected! try again with a better position.");
                //this.onNoClick();
                this.is_there_a_face = true;
              }
              this.allow_user_after_delay(this.delay_time);
              }, 
      err => {
              this.customLoader.setShowLoaderStatut(false); // stop the loader 
              console.log('HTTP Error',err);
              this.is_there_a_face = true;
              this.message_cam = "No Face Detected";
              this.allow_user_after_delay(this.delay_time);
              this.showNotif("warning","Connexion error!");
              //this.onNoClick();

              }) // end verifyFace
    
  }
  else if(this.action_type=="voter")
  {
    //console.log("loging...");
    //console.log(this.voter_data);
    var temp_block = new ChainData();
    temp_block.setchainBlocks(this.p2p.chain.getchainBlocks());
    var verif = false;
    for(var i=0;i<temp_block.getchainBlocks().length;i++)
    {
      if(temp_block.getchainBlocks()[i].data.publicHash == this.voter_data.personne.hash_code)
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
      this.is_there_a_face = true;
      this.allow_user_after_delay(this.delay_time);
      this.customLoader.setShowLoaderStatut(false); // stop the loader 
      alert("You already voted on this poll");
      this.onNoClick();

      setTimeout(()=>{
        this.route.navigate(["results"]);
      },1000);
      return;
    }

    this.facialVerification.verifierFace(this.voter_data).subscribe(
      data => { // true
              
              console.log(data); 
              if(data.status=="OK") //the two faces are equal
              { 
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                console.log("Exact match");
                this.showNotif("success","Exact match");
                this.onNoClick();
                // create the block 
                this.voter_block();
                
              }
              else if(data.status=="FAIL") //The two faces are different
              {
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                console.log("Incomplete match");
                this.showNotif("warning","Wrong face detected");
                //this.onNoClick();
                this.is_there_a_face = true;
              } 
              else if(data.status==0) // I was't able to locate...
              {
                this.customLoader.setShowLoaderStatut(false); // stop the loader
                console.log("No face detected! try again with a better position.");
                this.showNotif("warning","No face detected! try again with a better position.");
                //this.onNoClick();
                this.is_there_a_face = true;
              }
              this.allow_user_after_delay(this.delay_time);
              }, 
      err => {
              this.customLoader.setShowLoaderStatut(false); // stop the loader 
              console.log('HTTP Error',err);
              this.is_there_a_face = true;
              this.message_cam = "No Face Detected";
              this.allow_user_after_delay(this.delay_time);
              this.showNotif("warning","Connexion error!");
              //this.onNoClick();

              }) // end verifyFace
    
  }
  }

  checkVotedOrNot()
  {
    var verif = false;
    var temp_block = new ChainData();
    temp_block.setchainBlocks(this.p2p.chain.getchainBlocks());
    for(var i=0;temp_block.getchainBlocks().length;i++)
    {
      if(temp_block.getchainBlocks()[i].data.publicHash == this.voter_data.personne.hash_code)
      {
        verif = true;
        break;
      }
    }
    return verif;
  }
  voter_block()
  {
      // creating the block 
    console.log(this.voter_data.personne);
    console.log(this.voted_to);
    var temp_block = new ChainData();
    temp_block.setchainBlocks(this.p2p.chain.getchainBlocks());
    console.log("blockchain from panel", temp_block);

    var block = temp_block.createBlock(this.voter_data.personne, this.voted_to);
    block.mineBlock(temp_block.getDifficulty());
    
    temp_block.addBlock(block);

    this.p2p.chain.setchainBlocks(temp_block.getchainBlocks());

    console.log("voting for...");
    this.data_chain.type= "block";
    this.data_chain.data= block;
    var message = this.data_chain;
    console.log(message);
    var myJSON = JSON.stringify(message);

    this.p2p.sendingData(myJSON); 
    setTimeout(()=>{
      this.route.navigate(["results"]);
    },1000);
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    this.is_there_a_face = false;
    this.message_cam = error.message;
  }

  public allow_user_after_delay(t)
  {
  
    if(t>0){
      setTimeout(() => {
        this.delay_time-=1;
        //console.log(this.delay_time);
        this.allow_user_after_delay(this.delay_time);
      }, 1000);
    }
    else return;
  
  }

  captureImage()
  {
    this.trigger.next();
    //this.dialogRef.close(this.voter_image_captred);
  }

  onNoClick(): void {
     this.dialogRef.close();
  }

 

     //dafault  info success warning Whoops
  showNotif(type, message)
  {
    this.notifier.notify( type, message);
  }

}
