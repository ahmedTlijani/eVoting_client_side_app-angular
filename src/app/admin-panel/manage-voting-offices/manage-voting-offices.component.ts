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
import { OneVotingOfficeCComponent } from './one-voting-office-c/one-voting-office-c.component';

@Component({
  selector: 'app-manage-voting-offices',
  templateUrl: './manage-voting-offices.component.html',
  styleUrls: ['./manage-voting-offices.component.scss']
})
export class ManageVotingOfficesComponent implements OnInit {

  constructor(private BureauElectionSerivce : SpringAPiService,public dialog: MatDialog,notifierService: NotifierService, public customLoader: CustomLoaderService) { 
    this.notifier = notifierService;
  }
  
  ELEMENT_DATA:PeopleModel[];
  private readonly notifier: NotifierService;

  displayedColumns: string[] = ['id', 'name','state' , 'province','code_postal' ,'date_creation', 'max_number_voter','actions'];
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
    
    this.BureauElectionSerivce.getAllVotingOffices().subscribe(
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
      this.BureauElectionSerivce.deleteOneVotingOffice(element.office_id).subscribe(
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
    const dialogRef = this.dialog.open(OneVotingOfficeCComponent, {
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
    const dialogRef = this.dialog.open(OneVotingOfficeCComponent, {
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
 
}
