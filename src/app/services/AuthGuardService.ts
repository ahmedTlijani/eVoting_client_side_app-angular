import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './AuthService';
import { Observable } from 'rxjs';
import * as decode  from 'jwt-decode';
import { format } from 'url';


@Injectable()
export class AuthGuardService implements CanActivate {

    private user_role: string;
 
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggednIn()){
      let allowedRoles = next.data["allowedRoles"] as Array<String>;
      if(allowedRoles)
      {
        var match = this.authService.roleMatch(allowedRoles);
        if(match)
        {
          return true;
        } 
        else {
          this.router.navigate(['access-denied']);
          return false;
        }
      }
      else // if there is not a role in the path
        return true;

    }else{
      this.router.navigate(["home"]);
      return false;
    }
}
}