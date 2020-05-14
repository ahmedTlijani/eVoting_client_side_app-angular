import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { devModeEqual } from '@angular/core/src/change_detection/change_detection';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { p2pService } from 'src/app/services/p2pService';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from 'src/app/services/customLoaderService';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  private readonly notifier: NotifierService;

  // poupulation
  population: any = 0;
  population_data:any;


  // electeurs
  personne_inscrit:any = 0;
  personne_inscrit_percentage= 0;
  electeurs_data :any;
  // 300/2000*100 = 15%

  // from the blockchain -- p2pService
  voted_personne:any = 0;
  voted_personne_percentage = 0;
  voted_data: any;

  // parti 
  nombre_parti:any = 0;
  // bureau d'élection
  nombre_bureaux: any = 0;
  
  constructor(public customLoader: CustomLoaderService, notifierService: NotifierService ,private springService: SpringAPiService, private blockchainService: p2pService) 
  {
    this.notifier = notifierService;
  }
  
  ngOnInit() {
    //this.states.sort();
    this.getPopulation();
    this.getVotingOffices();
    this.getParties();
    /*this.getPersonneInscrit();
    setTimeout(()=>{
      this.getVoted();
    },2000);*/
    }

    // get all voting offices 
    getVotingOffices()
    {
      this.springService.getAllVotingOffices().subscribe(
        data => {
          this.nombre_bureaux = data.length;
        },
        err => {
          console.log("Error getting offices", err);
        }
      )
    }

    // get all voting offices 
    getParties()
    {
      this.springService.getAllParti().subscribe(
        data => {
          this.nombre_parti = data.length;
        },
        err => {
          console.log("Error getting parties", err);
        }
      )
    }
    // get all voting offices 
    getPersonneInscrit()
    {
      this.springService.getAllElecteur().subscribe(
        data => {
          console.log('personne inscrit',data);
          this.electeurs_data = data;
          this.personne_inscrit = data.length;
          // calcule pourcentage 
          var v = Math.floor(this.personne_inscrit / this.population * 100);
          this.personne_inscrit_percentage = v;
          this.getVoted();
        },
        err => {
          console.log("Error getting inscrits", err);
        }
      )
    }

    getPopulation()
    {
      this.springService.getAllPeopleDataSet().subscribe(
        data => {
          console.log('popuplation',data);
          this.population_data = data;
          this.population = data.length;

          this.getPersonneInscrit();

        },
        err => {
          console.log("Error getting datset", err);
        }
      )
    }

    getVoted() // blockchain
    {
      this.voted_personne = this.blockchainService.chain.getchainBlocks().length-1;
      this.voted_data = this.blockchainService.chain.getchainBlocks();
      console.log('voted',this.voted_data);
      // calcule pourcentage 
      console.log(this.voted_personne);
      console.log(this.personne_inscrit);
      if(this.voted_personne<=0)
      {
        this.voted_personne_percentage = 0;
        this.voted_personne = 0;
        return;
      }
      var v = Math.floor(this.voted_personne / this.personne_inscrit * 100);
      this.voted_personne_percentage = v;
    }

    //dafault  info success warning Whoops
    showNotif(type, message)
    {
      //this.hideAllNotifications();
      this.notifier.notify( type, message);
    }

}