import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Admin } from '../models/Admin';
import { ResponsableDeBureau } from '../models/ResponsableDeBureau';
import { Electeur } from '../models/Electeur';
import { p2pService } from './p2pService';

@Injectable()
export class AuthService {

  private baseurlVoter = 'http://localhost:8085/api/voter';
  private baseurlAdmin = 'http://localhost:8085/api/admin';
  private baseurlResponsable = 'http://localhost:8085/api/office-member/admin';

  private admin: Admin;
  private responsable: ResponsableDeBureau
  private electeur : Electeur;

  office_info: any = {
    state: null,
    province: null
  }; // bureau id used in voter inscription 

  constructor(private myRoute: Router , private http: HttpClient, public p2p: p2pService) { }
  
    
    // services for the authentification

    isLoggednIn() {
      return localStorage.getItem("usertoken") !== null;
    }

    logout(target) {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("id");
      this.myRoute.navigate([target]);
    }

    setTokens(userid, userRole)
    {
      localStorage.setItem("usertoken", this.makeid(26))
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("id", userid);
    }

    getIdToken()
    {
     return localStorage.getItem("id");
    }

    makeid(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
      return text;
    }


    //https://www.youtube.com/watch?v=Ks5ADKqPrBQ   later with the nav too

    roleMatch(allowedRoles): boolean {
      var isMatch = false;
      var userRoles = localStorage.getItem('userRole');
      console.log(userRoles);
      //debugger;
      allowedRoles.forEach(element => {
        if ( userRoles.indexOf(element) > -1 ) {
          isMatch = true;
          return false;
        }
        });
        return isMatch;
      }

      /* admin authentification
      *"/getAll"
      *"/get/{id}"
      *"/get-by-username/"
      */
      public adminAuthentification(admin: Admin): Observable<any>
      {
        return(this.http.post(this.baseurlAdmin + '/get-by-username', admin));
      }
      public setGlobalAdmin(admin: Admin)
      {
        this.admin = admin;
      }
      public getGLobalAdmin(): Admin
      {
        return this.admin;
      }
     
      public getAllAdmins(): Observable<any>
      {
        return(this.http.get<Admin[]>(this.baseurlAdmin + '/getAll'));
      }

      public responsableAuthentification(responsable: ResponsableDeBureau): Observable<any>
      {
        return(this.http.post(this.baseurlResponsable + '/get-by-username', responsable));
      }
      public setGlobalResposable(responsable: ResponsableDeBureau)
      {
        this.responsable = responsable;
      }
      public getGlobalResponsable(): ResponsableDeBureau
      {
        return this.responsable;
      }

      public setElecteur(electeur: Electeur)
      {
        this.electeur = electeur;
      }
      public getElecteur(): Electeur
      {
        return this.electeur;
      }

      public setInscriptionBureau(state,province)
      {
        this.office_info.state = state;
        this.office_info.province = province;
      }
      public getInscriptionBureau()
      {
        return this.office_info;
      }

}