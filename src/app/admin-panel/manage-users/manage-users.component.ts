import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TestingModel } from 'src/app/models/testingModel';
import { PeopleModel } from 'src/app/models/PeopleModel';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { OnePeopleEntryCComponent } from './one-people-entry-c/one-people-entry-c.component';
import { map } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { CustomLoaderService } from 'src/app/services/customLoaderService';
import { ImageViewerComponent } from 'src/app/image-viewer/image-viewer.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})




export class ManageUsersComponent implements OnInit {

  constructor(private peopleDataSetSerivce : SpringAPiService,public dialog: MatDialog,notifierService: NotifierService, public customLoader: CustomLoaderService) { 
    this.notifier = notifierService;
  }
  
  ELEMENT_DATA:PeopleModel[];
  private readonly notifier: NotifierService;

  displayedColumns: string[] = ['id', 'name', 'surname', 'date_naissance','gender', 'state' , 'province','code_postal' , 'cin', 'image' , 'actions' ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchValue = ''
  isLoading = true; // spinner loading
  state='';
  province= '';

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
    
    this.peopleDataSetSerivce.getAllPeopleDataSet().subscribe(
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
      this.peopleDataSetSerivce.deleteOnePeopeDataSet(element.id_personne_).subscribe(
        data => {
          this.customLoader.setShowLoaderStatut(false); // stop the loader 

                console.log("deleting");
                console.log(data);
                if(data) // data = true
                {
                  console.log("deleted!");
                  this.showNotif("default"," success Delete row ");
                  // update the datatable
                  this.getList();
                }else
                {
                  this.showNotif("default"," Cannot deleted this information at the moment, it can be used in other functionality");
                  console.log("couldnt delete");
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
    const dialogRef = this.dialog.open(OnePeopleEntryCComponent, {
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
    const dialogRef = this.dialog.open(OnePeopleEntryCComponent, {
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
