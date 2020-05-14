import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TestingModel } from 'src/app/models/testingModel';
import { PeopleModel } from 'src/app/models/PeopleModel';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { ImageViewerComponent } from 'src/app/image-viewer/image-viewer.component';
import { OneOfficeAdminCComponent } from './one-office-admin-c/one-office-admin-c.component';
import { ResponsableDeBureau } from 'src/app/models/ResponsableDeBureau';

@Component({
  selector: 'app-manage-offices-admins',
  templateUrl: './manage-offices-admins.component.html',
  styleUrls: ['./manage-offices-admins.component.scss']
})
export class ManageOfficesAdminsComponent implements OnInit {

  constructor(private responsableBureauService : SpringAPiService,public dialog: MatDialog,notifierService: NotifierService, public customLoader: CustomLoaderService) { 
    this.notifier = notifierService;
  }
  
  ELEMENT_DATA:ResponsableDeBureau[];
  private readonly notifier: NotifierService;

  displayedColumns: string[] = ['id', 'name', 'surname', 'date_naissance','gender', 'state' , 'province','code_postal' , 'cin', 'image','bureau_id','username','password', 'actions' ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchValue = ''
  isLoading = true; // spinner loading
  state='';
  province= '';

  bureau_information: string =''; 

  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


  ngOnInit() {

    //console.log(this.ELEMENT_DATA);
    
    this.getList();

  }
 
  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 

  getList()
  {  
    
    this.responsableBureauService.getAllResponsabelBureau().subscribe(
      data => {
          console.log(data);
          this.isLoading = false;
          this.ELEMENT_DATA= data;
          this.dataSource.data = data;


       }, 
       err => {
        this.showNotif("warning", "Connection error! " )
       console.log('HTTP Error',err);
       },
       () => console.log('HTTP request completed.')
    )  
}

  over(element)
  {
    ////element.bureau.name: Date de creation: element.data.creation_date | | date:shortDate, 
    //Adresse: element.data.adresse.state, element.data.adresse.province, element.data.adresse.code_postal
  console.log("over");
  this.bureau_information="";
  let bureau = element.bureau;
  let d= new Date(''+bureau.creation_date+'');

  let date_ = "" + d.getDate()+ " " + this.monthNames[d.getMonth()] + " " +  d.getFullYear();
  let info = bureau.name+" : Date de creation: "+ date_ + ", Max nombre d'électeur: "+ bureau.max_number_voter + ", Adresse: " + bureau.adresse.state+", "+ bureau.adresse.province+ ", "+ bureau.adresse.code_postal;
  this.bureau_information = info; 
  }
 

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteSearch()
  {
    this.searchValue='';
    this.applyFilter('');
  }
 
  deleteOne(element)
  {
    var txt;
    var r = confirm("WARNING! Are you sure you want to delete this row?!");
    if (r == true) {
      
      this.customLoader.setShowLoaderStatut(true); // run the loader 
      //console.log("loader statut ",this.customLoader.getLoaderStatut());
      this.responsableBureauService.deleteOneResponsabelBureau(element.id_responsable).subscribe(
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
 
  updateOne(element)
  {
    // get adresse id 
    
    this.openDialogUpdate(element);

    /// ----- 
  }

  addOne()
  {
    //console.log("updating");
    //console.log(element);
    this.openDialogAdd();
    /// ----- 
  }

  openDialogUpdate(element): void {
    const dialogRef = this.dialog.open(OneOfficeAdminCComponent, {
      data: {
        type : "Update",
         data: element
       }
    });

    dialogRef.afterClosed().subscribe(result => {
     //console.log('The dialog was closed');
     if(result && result.statut)
     {
       this.showNotif("success", "update with success" );
      // update the datatable
      this.getList();
     }else
     {
      this.showNotif("info", "Update Canceled" );
     }
     console.log(result);
    });
  }

  openDialogAdd(): void {
    const dialogRef = this.dialog.open(OneOfficeAdminCComponent, {
       data: {
         type : "Add",
          data: null
        }
    });

    dialogRef.afterClosed().subscribe(result => {
     // console.log('The dialog was closed');
     if(result && result.statut)
     {
       this.showNotif("success", "add with success" );
       // update the datatable
      this.getList();
     }else
     {
      this.showNotif("info", "Add canceled" );
     }
     console.log(result);
    });
  }


  // get adresse id from state and province
 


  //dafault  info success warning Whoops
  showNotif(type, message)
    {
      //this.hideAllNotifications();
      this.notifier.notify( type, message);
    }
    hideAllNotifications(): void {
      this.notifier.hideAll();
    }

    reloadDataSet()
    {
      this.dataSource.data = [];
      this.isLoading = true; // reload
      this.getList();
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


}
