import { Component, OnInit, ViewChild } from '@angular/core';
import { p2pService } from 'src/app/services/p2pService';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { ResponsableDeBureau } from 'src/app/models/ResponsableDeBureau';
import { VotersOfficeAdminComponent } from '../voters-office-admin/voters-office-admin.component';
import { MatBottomSheetRef, MatBottomSheet, MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { ElecteurPieChartComponent } from '../electeur-pie-chart/electeur-pie-chart.component';
import { PeopleModel } from 'src/app/models/PeopleModel';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { ImageViewerComponent } from 'src/app/image-viewer/image-viewer.component';

@Component({
  selector: 'app-office-admin-dashboard',
  templateUrl: './office-admin-dashboard.component.html',
  styleUrls: ['./office-admin-dashboard.component.scss']
})
export class OfficeAdminDashboardComponent implements OnInit {

  private readonly notifier: NotifierService;
  responsabel: any;

  office_region:any = "";

  region_dataset=[];

  personne_inscrit:any = 0;
  personne_inscrit_percentage= 0;

  voted_personne_percentage = 0;
  vot_region = 0; // voter pour cette region
  inscr = [];

  votingData: any = []; //block

  nombre_parti:any = 0;
  nombre_bureaux: any = 0;

  pie_data = {
    non_inscription:0,
    inscription_non_vote:0,
    voter:0
  };
  btn_dis = true; // cahnge it to true



  ELEMENT_DATA:any[];

  displayedColumns: string[] = ['name', 'surname','cin','image','hash','status'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchValue = ''
  isLoading = true; // spinner loading
  
  
  constructor(private peopleDataSetSerivce : SpringAPiService,public dialog: MatDialog,private bottomSheet: MatBottomSheet, public p2p: p2pService ,public customLoader: CustomLoaderService, notifierService: NotifierService ,private auth : AuthService, private route: Router) 
  { 
    this.notifier = notifierService;
    this.responsabel = this.auth.getGlobalResponsable();
    if(this.responsabel)this.office_region = this.responsabel.bureau.adresse.state;

    console.log('responsabel: ',this.responsabel);
   }

   ngOnInit() {
    this.getVotingOffices();
    this.getParties();
    this.getList();
  }

   openBottomSheet(): void {
    // recreate piedata
    //pie_data = { non_inscription:0, inscription_non_vote:0, voter:0 };
    var non_inscription = this.region_dataset.length - this.inscr.length ; //region_data_set.lenght - isncr

    var inscription_non_vote=0 ; // element_data if 0 -> n'est pas voté
    var voter =0; //element_data.lenght - inscipption non vote
     
    console.log("pie element",this.ELEMENT_DATA);
    for(var i=0;i<this.ELEMENT_DATA.length;i++)
    {
      if(this.ELEMENT_DATA[i].status==0)
      {
        inscription_non_vote+=1;
      }else
      {
        voter+=1;
      }
    }

    this.pie_data.non_inscription = non_inscription;
    this.pie_data.inscription_non_vote = inscription_non_vote;
    this.pie_data.voter = voter;
     
    this.bottomSheet.open(ElecteurPieChartComponent, {
      data: {
        pie : this.pie_data,
        title: this.office_region
      }

    });
  }
   

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteSearch()
  {
    this.searchValue='';
    this.applyFilter('');
  }

    //dafault  info success warning Whoops
    showNotif(type, message)
    {
      //this.hideAllNotifications();
      this.notifier.notify( type, message);
    }

    showImage(imageSrc)
    {
      this.openDialogShowImage(imageSrc);
    }

    openDialogShowImage(element): void {
      const dialogRef = this.dialog.open(ImageViewerComponent, {
        data: element
      });
      dialogRef.afterClosed().subscribe(result => {});
    }

     // get all voting offices 
     getVotingOffices()
     {
       this.peopleDataSetSerivce.getAllVotingOffices().subscribe(
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
       this.peopleDataSetSerivce.getAllParti().subscribe(
         data => {
           this.nombre_parti = data.length;
         },
         err => {
           console.log("Error getting parties", err);
         }
       )
     }

  getList()
  {  
    // only 
    if(!this.responsabel)return;
    this.peopleDataSetSerivce.getAllElecteur().subscribe(
      data => {
          console.log(data);

          this.extractPerosnneInscrit(data); // get personne inscrit number , by state
          this.getPopulationState(this.responsabel.bureau.adresse.adresse_id); // get population by state to calculate the pourcenage
          var arr = [];
         
          setTimeout(()=>{
            this.getVoted(); // get the blockchain
            for(var i=0;i<data.length;i++)
            {
              if(data[i].bureau.office_id == this.responsabel.bureau.office_id)
              {
                //'name', 'surname','cin','image','status'
                var v = 0; //'En cours';
                if(this.checkVoteStatus(data[i].hash_code))v= 1;//'Voté';
                var a = { name: data[i].person.name, surname: data[i].person.surname, cin:data[i].cin,image: data[i].person.image,hash:data[i].hash_code ,status: v};
                arr.push(a);
              }
            }
            this.fillVoted();
  
            console.log("Personne de cette region", arr);
            this.isLoading = false;
            this.ELEMENT_DATA= arr;
            this.dataSource.data = arr;

            this.btn_dis = false; // activate button

          },2000);
          
       }, 
       err => {
        this.showNotif("warning", "Connection error! " )
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
  }

 

    getVoted() // blockchain
     {
       this.votingData = this.p2p.chain.getchainBlocks();
       console.log('voted',this.votingData);
     }

     checkVoteStatus(hash)
     {
        var verif = false;
        for(var i=0;i<this.votingData.length;i++) // check all blockchain 
        {
            if(this.votingData[i].data.publicHash==hash)
            {
              verif = true;
              break;
            }
        }
        return verif;
     }
   
     fillVoted()
     {
       console.log("fill voted ------------ ");
       console.log(this.votingData);
       console.log(this.inscr);

        for(var i=0;i<this.votingData.length;i++) // check all states 
        { 
          for(var j=0;j<this.inscr.length;j++) // check all electeurs 
          {
            if(this.votingData[i].data.publicHash == this.inscr[j].hash_code) // if the same hash get the adresse 
            {
             this.vot_region+=1;
            }
          }
        }
        // calcuule percetange  personneinscrit vot_region
        var v = Math.floor(this.vot_region / this.personne_inscrit * 100);
        this.voted_personne_percentage = v;

     }

     extractPerosnneInscrit(data)
     {
      for(var i=0;i<data.length;i++)
      {
        if(data[i].bureau.office_id == this.responsabel.bureau.office_id)
        {
          this.personne_inscrit+=1;
          this.inscr.push(data[i]);
        }
      }
     }
     

     getPopulationState(id)
     {
       this.peopleDataSetSerivce.getAllPeopleDataSet().subscribe(
         data=>{
          //console.log(data); // data[i].adresse.adresse_id
          for(var i=0;i<data.length;i++)
          {
            if(data[i].adresse.adresse_id ==id)
            {
              this.region_dataset.push(data[i]);
            }
          }
          // calcule de percentage
          setTimeout(()=>
          {
            console.log('data set de cette region',this.region_dataset);
            var v = Math.floor(this.personne_inscrit / this.region_dataset.length * 100);
            this.personne_inscrit_percentage = v;
          },1000);
         

         },
         err=>{
           console.log(err);
         }
       )
     }
}
