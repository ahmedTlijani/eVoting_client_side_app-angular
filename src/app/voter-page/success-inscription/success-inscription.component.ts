import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';


@Component({
  selector: 'app-success-inscription',
  templateUrl: './success-inscription.component.html',
  styleUrls: ['./success-inscription.component.scss']
})
export class SuccessInscriptionComponent implements OnInit {

 deadline = 'November 10 2019 00:00:00 GMT+0200';


  constructor() { }

  
  ngOnInit() {
  }

  

 
}
