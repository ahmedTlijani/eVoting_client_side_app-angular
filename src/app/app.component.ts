import { Component, OnInit } from '@angular/core';
import { CustomLoaderService } from './services/customLoaderService';
import { p2pService } from './services/p2pService';
import {HostListener} from "@angular/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = ' Plateforme d\'\élection electronique ';

  showLoader: boolean ;

  constructor(public loaderService: CustomLoaderService, public p2p: p2pService)
  {}

  
  //https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
  ngOnInit() {

   this.loaderService.currentStatut.subscribe(data =>
    {
     // console.log(this.showLoader);
      this.showLoader = data;
    })

  }

  /* 
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: Event) {
    // Your logic on beforeunload
    console.log(event);
    alert(event);
    return false;
  }
  */
 

}
