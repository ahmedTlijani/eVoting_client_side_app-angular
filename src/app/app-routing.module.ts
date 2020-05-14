import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  AuthentificationPageComponent } from './authentification-page/authentification-page.component'
import { HomePageComponent } from './home-page/home-page.component'
import { AuthGuardService } from './services/AuthGuardService';
import { AccessDeniedComponent } from './access-denied/access-denied.component'
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ManageUsersComponent } from './admin-panel/manage-users/manage-users.component'
import { AdminDashboardComponent } from './admin-panel/admin-dashboard/admin-dashboard.component';
import { SuperAdminPanelComponent } from './super-admin-panel/super-admin-panel.component';
import { OfficeAdminPanelComponent } from './office-admin-panel/office-admin-panel.component';
import { VoterPanelComponent } from './voter-page/voter-panel/voter-panel.component';
import { VoterInscriptionComponent } from './voter-page/voter-inscription/voter-inscription.component';
import { VoterLoginComponent } from './voter-page/voter-login/voter-login.component';
import { ManageAdressesComponent } from './admin-panel/manage-adresses/manage-adresses.component';
import { ManageOfficesAdminsComponent } from './admin-panel/manage-offices-admins/manage-offices-admins.component';
import { ManagePartisComponent } from './admin-panel/manage-partis/manage-partis.component';
import { ManageVotingOfficesComponent } from './admin-panel/manage-voting-offices/manage-voting-offices.component';
import { VotersOfficeAdminComponent } from './office-admin-panel/voters-office-admin/voters-office-admin.component';
import { OfficeAdminDashboardComponent } from './office-admin-panel/office-admin-dashboard/office-admin-dashboard.component';
import { SuccessInscriptionComponent } from './voter-page/success-inscription/success-inscription.component';
import { ResultPageComponent } from './office-admin-panel/result-page/result-page.component';
import { ResultsVComponent } from './voter-page/results-v/results-v.component';
import { ResultAdminPageComponent } from './admin-panel/result-admin-page/result-admin-page.component';
import { BlockchainVisualisationComponent } from './blockchain-visualisation/blockchain-visualisation.component';
import { ElecteurListComponent } from './admin-panel/electeur-list/electeur-list.component';

const routes: Routes = [
  {  //  office-admin -- admin -> manager office-admin
    path: 'home', component: AuthentificationPageComponent , //HomePageComponent
  },

  { //
    path: '', component: AuthentificationPageComponent  ,
  },  

  { // electeur vote ici
    path: 'voter-panel', component: VoterPanelComponent  ,canActivate: [AuthGuardService],data: {allowedRoles:  ['voter' ]}
  },
  { // success-inscription
    path: 'success-inscription', component: SuccessInscriptionComponent
  },

  { // electeur login here // we need to acces this componenet anytime
    path: 'voter-inscription', component: VoterInscriptionComponent
  },

  { // electeur inscription here // we need to acces this componenet anytime
    path: 'voter-login', component: VoterLoginComponent
  },

  { //
    path: 'results', component: ResultsVComponent,canActivate: [AuthGuardService],data: {allowedRoles:  ['voter']}
  },


  { 
    path: 'login', component: AuthentificationPageComponent, 
  }, // authetification page localhost:4200/login

  { 
    path: 'office-admin-panel', component: OfficeAdminPanelComponent, canActivate: [AuthGuardService],data: {allowedRoles:  ['office-admin' ]},
    children: [
      {
      path:  'dashboard',
      component:  OfficeAdminDashboardComponent
      },
      {
        path:  '',
        component:  OfficeAdminDashboardComponent
      },
      {
      path:  'voters',
      component:  VotersOfficeAdminComponent
      },
      {
        path:  'results',
        component:  ResultPageComponent
      },

    ],
  },

  {
    path: 'admin-panel' , component: AdminPanelComponent, canActivate: [AuthGuardService],data: { allowedRoles:  ['admin']}, 
    children: [
      {
      path:  'manage-people',
      component:  ManageUsersComponent
      },
      {
      path:  'dashboard',
      component:  AdminDashboardComponent
      },
      {
        path:  '',
        component:  AdminDashboardComponent
      },
      {
        path:  'manage-locations',
        component:  ManageAdressesComponent
       },
      {
        path:  'manage-offices-admins',
        component:  ManageOfficesAdminsComponent
       },
       {
        path:  'manage-partis',
        component:  ManagePartisComponent
       },
       {
        path:  'manage-voting-offices',
        component:  ManageVotingOfficesComponent
       },
       {
        path:  'results',
        component:  ResultAdminPageComponent
      },
      {
        path:  'blockchain',
        component:  BlockchainVisualisationComponent
      },
      {
        path:  'electeur-list',
        component:  ElecteurListComponent
      },

    ],
      
  },
  {
    path: 'access-denied' , component: AccessDeniedComponent,canActivate: [AuthGuardService]
  },
 
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
