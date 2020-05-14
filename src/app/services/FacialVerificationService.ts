import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { map, catchError, tap ,delay } from 'rxjs/operators';
 
@Injectable()
export class FacialVerificationService {

  
  constructor(private myRoute: Router, private http: HttpClient) { }
  
  private verificationUrl = 'http://127.0.0.1:5000/api/verify-face/';

  public verifierFace(dataObject: any) : Observable<any> // testing to python api directly
  {
    let link = this.verificationUrl;
    let data = {
      cin : dataObject.cin,
      known_image : dataObject.image_captured,
      unknown_image: dataObject.image_captured
    }
    return(this.http.post(link, data));
  }
 

}