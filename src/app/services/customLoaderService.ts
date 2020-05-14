import { Injectable,Output,EventEmitter} from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class CustomLoaderService {
  

    private showLoader = new BehaviorSubject(false);
    currentStatut = this.showLoader.asObservable();

    constructor() {}
 
    setShowLoaderStatut(s : boolean)
    {
        this.showLoader.next(s);
    }

    getLoaderStatut()
    {
        return this.showLoader;
    }
   

} 