import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { map, catchError, tap ,delay } from 'rxjs/operators';
import { PeopleModel } from '../models/PeopleModel';
import { Adresse } from '../models/Adresse';
 
@Injectable()
export class UplaodService {
  
  constructor(private myRoute: Router, private http: HttpClient) { }
  
  private baseurlUpload = 'http://localhost:8085/api/image';


  public uplaodImage(cin,base64image): Observable<any>
  {
    return this.http.post(this.baseurlUpload +'/upload/' + cin, base64image);
    //return of("Imagesrcccccc").pipe(delay(2000)); // for testing 
  }


}