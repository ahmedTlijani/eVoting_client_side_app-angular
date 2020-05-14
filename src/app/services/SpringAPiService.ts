import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { map, catchError, tap ,delay } from 'rxjs/operators';
import { PeopleModel } from '../models/PeopleModel';
import { Adresse } from '../models/Adresse';
import { BureauElection } from '../models/BureauElection';
import { Admin } from '../models/Admin';
import { Parti } from '../models/Parti';
import { ResponsableDeBureau } from '../models/ResponsableDeBureau';
import { Electeur } from '../models/Electeur';

@Injectable()
export class SpringAPiService {
  
  constructor(private myRoute: Router, private http: HttpClient) { }
  
  private baseurlPeople = 'http://localhost:8085/api/people-data-set/';
  private baseurlAdresses = 'http://localhost:8085/api/adresse/';
  private baseurlOfficeAdmins ='http://localhost:8085/api/office-member/admin/';
  private baseurlBureauElection ='http://localhost:8085/api/voting-office/';
  private baseurlElecteur ='http://localhost:8085/api/voter/';
  private baseurlParti ='http://localhost:8085/api/parti/';
  private verificationUrl = 'http://localhost:8085/api/verify-face/';


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }


  //https://www.djamware.com/post/5b87894280aca74669894414/angular-6-httpclient-consume-restful-api-example
  
  // testing data...
  ELEMENT_DATA: PeopleModel[] = [ 
    {id_personne_: 1, name: 'Hydrogen', surname:'hyd', date_naissance: new Date(), gender: 'male' , adresse_id:2, cin: '09987673', image:'path'},
    {id_personne_: 2, name: 'Carbone', surname:'hyd', date_naissance: new Date(),gender:'female' , adresse_id:2, cin: '09987673', image:'path'},
    {id_personne_: 3, name: 'Ahmed', surname:'hyd', date_naissance: new Date(),gender:'male' ,adresse_id:2, cin: '09987673', image:'path'},
    {id_personne_: 4, name: 'Hydrogen', surname:'hyd',date_naissance: new Date(), gender:'male' ,  adresse_id:2, cin: '09987673', image:'path'},
   ];

   PEOPLE_DATA ;

   /* manage people  //baseurlPeople
   * "/getAll"
   * "/create"
   * "/update/{id}/{id_adresse}"
   * "/delete/{id}"
   * "/get/{id}"
  */

  public getAllPeopleDataSet(): Observable<any>
  {
    return(this.http.get<PeopleModel[]>(this.baseurlPeople + 'getAll'));
    //return of(this.ELEMENT_DATA).pipe(delay(2000)); // for testing 
  }

  public getTestingData(): Observable<any>
  {
    return of(this.ELEMENT_DATA).pipe(delay(2000)); // for testing 
  }

  public deleteOnePeopeDataSet(id_personne_) : Observable<any>
  {
    //for(let i=0;i<this.ELEMENT_DATA.length;i++) { if(this.ELEMENT_DATA[i].id_personne_ == id_personne_){this.ELEMENT_DATA.splice(i,1);}}
    //console.log(this.ELEMENT_DATA);
    return(this.http.delete(this.baseurlPeople + 'delete/' + id_personne_));
    //return of(true);
  }


  public updateOnePeopleDataSet(personne: PeopleModel) : Observable<any>
  {
    return(this.http.put(this.baseurlPeople + 'update/' + personne.id_personne_ +'/' + personne.adresse_id , personne));
    //console.log(personne);
    //return of(true);
  }

  public addOnePeopleDataSet(personne: PeopleModel) : Observable<any>
  {
    return(this.http.post(this.baseurlPeople +'/'+ personne.adresse_id +'/create' , personne));
    //console.log(personne);
    //return of(true);
  }

  public getOnePeopleDataSet(id_personne_)
  {
    return(this.http.get<PeopleModel>(this.baseurlPeople + 'get/' + id_personne_));
  }

  // check if voter is exist in peopeldataset
  public getOnePeopleByCinDate(people : PeopleModel): Observable<any>
  {
    return(this.http.post(this.baseurlPeople + 'get-by-cin-date', people));
  }

  
  /* manage adresses // baseurlAdresses
   * "/getAll"
   * "/create"
   * "/update/{id_adresse}"
   * "/delete/{id}"
   * "/get/{id}"
   * "get-by-state/{state}"
   * "get-code-postal/{adresse_id}"
   * "get-adresse-id/{state}/{province}"
   * 
  */

  public getAllAdresseDataSet(): Observable<any>
  {
    return(this.http.get<Adresse[]>(this.baseurlAdresses + 'getAll'));
  }

  public deleteOneAdresse(adresse_id) : Observable<any>
  {
    return(this.http.delete(this.baseurlAdresses + 'delete/' + adresse_id));
  }
  
  public updateOneAdressePeopleDataSet(adresse: Adresse) : Observable<any>
  {
    return(this.http.put(this.baseurlAdresses + 'update/' + adresse.adresse_id , adresse));
  }

  public addOneAdresse(adresse: Adresse) : Observable<any>
  {
    return(this.http.post(this.baseurlAdresses + 'create' , adresse));
  }

  public getOneAdresse(adresse_id): Observable<any>
  {
    return(this.http.get<Adresse>(this.baseurlAdresses + 'get/' + adresse_id));
  }

  public getProvincesByState(state): Observable<any>
  {
    return(this.http.get(this.baseurlAdresses+'get-by-state/' + state));
  }

  public getCodePostalByAdresseId(id_adresse): Observable<any>
  {
    return(this.http.get(this.baseurlAdresses+'get-code-postal/' + id_adresse));
  }

  public getAdresseId(state, province): Observable<any>
  {
    return(this.http.get(this.baseurlAdresses+'get-adresse-id/' + state +'/' + province));
  }

   /* manage Office admins // baseurlOfficeAdmins
   * "/getAll"
   * "/{id_adresse}/{id_bureau}/create"
   * "/update/{id}/{id_adresse}/{id_bureau}"
   * "/delete/{id}"
   * "/get/{id}"
  */

  public getAllResponsabelBureau(): Observable<any>
  {
    return(this.http.get<ResponsableDeBureau[]>(this.baseurlOfficeAdmins + 'getAll'));
  }

  public deleteOneResponsabelBureau(responsabel_id) : Observable<any>
  {
    return(this.http.delete(this.baseurlOfficeAdmins + 'delete/' + responsabel_id));
  }
  
  public updateOneResponsabelBureau(responsable: ResponsableDeBureau) : Observable<any>
  {
    return(this.http.put(this.baseurlOfficeAdmins + 'update/' + responsable.id_responsable + '/' + responsable.adresse_id + '/' + responsable.bureau_id, responsable ));
  }

  public addOneResponsabelBureau(responsable: ResponsableDeBureau) : Observable<any>
  {
    return(this.http.post(this.baseurlOfficeAdmins +responsable.adresse_id+ '/' + responsable.bureau_id +'/create' , responsable));
  }

  public getOneResponsabelBureau(responsabel_id): Observable<any>
  {
    return(this.http.get<ResponsableDeBureau>(this.baseurlOfficeAdmins + 'get/' + responsabel_id));
  }

   /* manage Bureau election // baseurlBureauElection
   * "/getAll"
   * "/{admin_id}/{id_adresse}/create"
   * "/update/{id}/{id_adresse}"
   * "/delete/{id}"
   * "/get/{id}"
  */

  public getAllVotingOffices(): Observable<any>
  {
    return(this.http.get<BureauElection[]>(this.baseurlBureauElection + 'getAll'));
  }

  public deleteOneVotingOffice(office_id) : Observable<any>
  {
    return(this.http.delete(this.baseurlBureauElection + 'delete/' + office_id));
  }
  
  public updateOneVotingOffice(bureau: BureauElection) : Observable<any>
  {
    return(this.http.put(this.baseurlBureauElection + 'update/' + bureau.office_id + '/' + bureau.adresse_id, bureau ));
  }

  public addOneVotingOffice(bureau: BureauElection) : Observable<any>
  {
    return(this.http.post(this.baseurlBureauElection +bureau.admin_id+ '/' + bureau.adresse_id +'/create' , bureau));
  }

  public getOneVotingOffice(office_id): Observable<any>
  {
    return(this.http.get<BureauElection>(this.baseurlBureauElection + 'get/' + office_id));
  }

  public getOneVotingOfficeByAdresseId(adresse_id): Observable<any>
  {
    return(this.http.get<BureauElection>(this.baseurlBureauElection + 'getByAdresseId/' + adresse_id));
  }
  


   /* manage voter (electeur) // baseurlElecteur
   * "/getAll"
   * "/{person_id}/{id_bureau}/create"
   * "/delete/{id}"
   * "/get/{id}"
   * * "/get-by-cin/{cin}"
  */

  public getAllElecteur(): Observable<any>
  {
    return(this.http.get<Electeur[]>(this.baseurlElecteur + 'getAll'));
  }

  public addOneElecteur(electeur: Electeur) : Observable<any>
  {
    return(this.http.post(this.baseurlElecteur +electeur.person_information+ '/' + electeur.office_id +'/create' , electeur));
  }


  public getOneElecteur(cin): Observable<any>
  {
    return(this.http.get<Electeur>(this.baseurlElecteur + 'get/' + cin));
  }

  public getOneElecteurByCinData(people: PeopleModel): Observable<any>
  {
    return(this.http.post(this.baseurlElecteur + 'get-by-cin-date/' + people.cin, people));
  }

  public deleteOneElecteur(electeur_id) : Observable<any>
  {
    return(this.http.delete(this.baseurlElecteur + 'delete/' + electeur_id));
  }


   /* manage Parti // baseurlParti
   * "/getAll"
   * "/{admin_id}/{id_adresse}/create"
   * "/update/{id}/{id_adresse}"
   * "/delete/{id}"
   * "/get/{id}"
  */

  public getAllParti(): Observable<any>
  {
    return(this.http.get<Parti[]>(this.baseurlParti + 'getAll'));
  }

  public deleteOneParti(parti_id) : Observable<any>
  {
    return(this.http.delete(this.baseurlParti + 'delete/' + parti_id));
  }
  
  public updateOneParti(parti: Parti) : Observable<any>
  {
    return(this.http.put(this.baseurlParti + 'update/' + parti.parti_id + '/' + parti.adresse_id, parti ));
  }

  public addOneParti(parti: Parti) : Observable<any>
  {
    return(this.http.post(this.baseurlParti +parti.admin_id+ '/' + parti.adresse_id +'/create' , parti));
  }

  public getOneParti(parti_id): Observable<any>
  {
    return(this.http.get<BureauElection>(this.baseurlParti + 'get/' + parti_id));
  }

  
  // face verification 
  public verifierFace(dataObject: any) : Observable<any> // testing with spring api and python
  {
    let data = dataObject.image_captured;
    console.log(dataObject.personne.cin)
    return(this.http.post(this.verificationUrl + 'verify/'+ dataObject.personne.cin , data));
  }


}