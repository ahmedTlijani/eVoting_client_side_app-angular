import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatBottomSheet, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { p2pService } from 'src/app/services/p2pService';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { ImageViewerComponent } from 'src/app/image-viewer/image-viewer.component';

@Component({
  selector: 'app-electeur-list',
  templateUrl: './electeur-list.component.html',
  styleUrls: ['./electeur-list.component.scss']
})
export class ElecteurListComponent implements OnInit {

  private readonly notifier: NotifierService;
  ELEMENT_DATA:any[];

  votingData: any = []; //block

  displayedColumns: string[] = ['name', 'surname','cin','image','hash','office','status','actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchValue = ''
  isLoading = true; // spinner loading

  
  constructor(private peopleDataSetSerivce : SpringAPiService,public dialog: MatDialog,private bottomSheet: MatBottomSheet, public p2p: p2pService ,public customLoader: CustomLoaderService, notifierService: NotifierService ,private auth : AuthService, private route: Router) { 
    this.notifier = notifierService;
  }
  ngOnInit() {
    this.getList();
  }


  getList()
  {  
    // only 
    this.peopleDataSetSerivce.getAllElecteur().subscribe(
      data => {
          console.log(data);
          var arr = [];
          this.getVoted(); // get the blockchain

          setTimeout(()=>{
            for(var i=0;i<data.length;i++)
            {
                //'name', 'surname','cin','image','status'
                var v = 0; //'En cours';
                let info = data[i].bureau.name+" : Date de creation: "+ data[i].bureau.creation_date + ", Max nombre d'électeur: "+ data[i].bureau.max_number_voter + ", Adresse: " + data[i].bureau.adresse.state+", "+ data[i].bureau.adresse.province+ ", "+ data[i].bureau.adresse.code_postal;
                if(this.checkVoteStatus(data[i].hash_code))v= 1;//'Voté';
                var a = { id: data[i].id_electeur ,name: data[i].person.name, surname: data[i].person.surname,office: data[i].bureau.name, office_detail:info, cin:data[i].cin,image: data[i].person.image,hash:data[i].hash_code ,status: v};
                arr.push(a);

            }
  
            console.log("Personne de cette region", arr);
            this.isLoading = false;
            this.ELEMENT_DATA= arr;
            this.dataSource.data = arr;

          },2000);
          
       }, 
       err => {
        this.showNotif("warning", "Connection error! " )
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
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

    getVoted() // blockchain
     {
       this.votingData = this.p2p.chain.getchainBlocks();
       console.log('voted',this.votingData);
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

   

   deleteOne(element)
   {
     var txt;
     var r = confirm("WARNING! Are you sure you want to delete this row?!");
     if (r == true) {
       
       this.customLoader.setShowLoaderStatut(true); // run the loader 
       //console.log("loader statut ",this.customLoader.getLoaderStatut());
       this.peopleDataSetSerivce.deleteOneElecteur(element.id).subscribe(
         data => {
           this.customLoader.setShowLoaderStatut(false); // stop the loader 
 
                 console.log("deleting");
                 if(data) // data = true
                 {
                   console.log("deleted!");
                   this.showNotif("default"," success Delete row ");
                   console.log(data);
                   // update the datatable
                   this.getList();
                 }
                 
                 }, 
                 err => {
                   this.customLoader.setShowLoaderStatut(false); // stop the loader 
 
                 this.showNotif("warning"," Conection error ");
                 console.log('HTTP Error',err);
                 },
                 () => { 
                   this.customLoader.setShowLoaderStatut(false); // stop the loader 
                   console.log('HTTP request completed.')
                 }
               )  ;
       
       //console.log(element);
       
       /// ----- 
       this.dataSource.data = this.ELEMENT_DATA;
 
     } else {
       console.log("You pressed Cancel!");
     }
   }
  


}
