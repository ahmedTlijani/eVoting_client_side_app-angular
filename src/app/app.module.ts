import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthentificationPageComponent } from './authentification-page/authentification-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuardService } from './services/AuthGuardService'
import { AuthService } from './services/AuthService';

import { JwtModule,JwtHelperService,JWT_OPTIONS, JwtInterceptor } from '@auth0/angular-jwt';
//https://codinglatte.com/posts/angular/role-based-authorization-in-angular-route-guards/
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HighchartsChartModule } from 'highcharts-angular';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule, MatNativeDateModule } from "@angular/material";
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatDialog} from '@angular/material/dialog';


import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';

import { ParticlesModule } from 'angular-particle';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotifierModule, NotifierOptions } from 'angular-notifier';

import {WebcamModule} from 'ngx-webcam';
import { AngularFileUploaderModule } from "angular-file-uploader";


import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminDashboardComponent } from './admin-panel/admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './admin-panel/manage-users/manage-users.component';
import { SuperAdminPanelComponent } from './super-admin-panel/super-admin-panel.component';
import { OfficeAdminPanelComponent } from './office-admin-panel/office-admin-panel.component';
import { SpringAPiService } from './services/SpringAPiService';
import { HttpClientModule } from '@angular/common/http';
import { OnePeopleEntryCComponent } from './admin-panel/manage-users/one-people-entry-c/one-people-entry-c.component';
import { CustomLoaderService } from './services/customLoaderService';
import { VoterLoginComponent } from './voter-page/voter-login/voter-login.component';
import { VoterInscriptionComponent } from './voter-page/voter-inscription/voter-inscription.component';
import { VoterPanelComponent } from './voter-page/voter-panel/voter-panel.component';
import { VoterCameraComponent } from './voter-page/voter-camera/voter-camera.component';
import { FacialVerificationService } from './services/FacialVerificationService';
import { ManageAdressesComponent } from './admin-panel/manage-adresses/manage-adresses.component';
import { ManageOfficesAdminsComponent } from './admin-panel/manage-offices-admins/manage-offices-admins.component';
import { ManagePartisComponent } from './admin-panel/manage-partis/manage-partis.component';
import { ManageVotingOfficesComponent } from './admin-panel/manage-voting-offices/manage-voting-offices.component';
import { OneAdresseEntryCComponent } from './admin-panel/manage-adresses/one-adresse-entry-c/one-adresse-entry-c.component';
import { OneOfficeAdminCComponent } from './admin-panel/manage-offices-admins/one-office-admin-c/one-office-admin-c.component';
import { OnePartiCComponent } from './admin-panel/manage-partis/one-parti-c/one-parti-c.component';
import { OneVotingOfficeCComponent } from './admin-panel/manage-voting-offices/one-voting-office-c/one-voting-office-c.component';
import { UplaodService } from './services/UploadService';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { VotersOfficeAdminComponent } from './office-admin-panel/voters-office-admin/voters-office-admin.component';
import { OfficeAdminDashboardComponent } from './office-admin-panel/office-admin-dashboard/office-admin-dashboard.component';
import { VoterInscriptionChartComponent } from './voter-inscription-chart/voter-inscription-chart.component';
import { SuccessInscriptionComponent } from './voter-page/success-inscription/success-inscription.component';
import { CountdownComponentComponent } from './countdown-component/countdown-component.component';
import { p2pService } from './services/p2pService';
import { ParticaleEffectComponent } from './particale-effect/particale-effect.component';
import { ElecteurPieChartComponent } from './office-admin-panel/electeur-pie-chart/electeur-pie-chart.component';
import { GeneralResultComponent } from './results/general-result/general-result.component';
import { ResultPageComponent } from './office-admin-panel/result-page/result-page.component';
import { ResultsVComponent } from './voter-page/results-v/results-v.component';
import { ResultAdminPageComponent } from './admin-panel/result-admin-page/result-admin-page.component';
import { BlockchainVisualisationComponent } from './blockchain-visualisation/blockchain-visualisation.component';
import { ElecteurListComponent } from './admin-panel/electeur-list/electeur-list.component';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 80,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    AuthentificationPageComponent,
    HomePageComponent,
    AccessDeniedComponent,
    AdminPanelComponent,
    AdminDashboardComponent,
    ManageUsersComponent,
    SuperAdminPanelComponent,
    OfficeAdminPanelComponent,
    OnePeopleEntryCComponent,
    VoterLoginComponent,
    VoterInscriptionComponent,
    VoterPanelComponent,
    VoterCameraComponent,
    ManageAdressesComponent,
    ManageOfficesAdminsComponent,
    ManagePartisComponent,
    ManageVotingOfficesComponent,
    OneAdresseEntryCComponent,
    OneOfficeAdminCComponent,
    OnePartiCComponent,
    OneVotingOfficeCComponent,
    ImageViewerComponent,
    VotersOfficeAdminComponent,
    OfficeAdminDashboardComponent,
    VoterInscriptionChartComponent,
    SuccessInscriptionComponent,
    CountdownComponentComponent,
    ParticaleEffectComponent,
    ElecteurPieChartComponent,
    GeneralResultComponent,
    ResultPageComponent,
    ResultsVComponent,
    ResultAdminPageComponent,
    BlockchainVisualisationComponent,
    ElecteurListComponent,
    
   ],
  entryComponents: [
    OnePeopleEntryCComponent, // entry componenet for the dialog
    VoterCameraComponent,
    OneAdresseEntryCComponent,
    OneOfficeAdminCComponent,
    OnePartiCComponent,
    OneVotingOfficeCComponent,
    ImageViewerComponent,
    ElecteurPieChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    //JwtModule.forRoot({}),
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule, 
    MatSortModule, 
    MatTableModule,
    HttpClientModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatGridListModule,
    MatCardModule,
    NotifierModule.withConfig(customNotifierOptions),
    WebcamModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    AngularFileUploaderModule,
    MatTooltipModule,
    HighchartsChartModule,
    ParticlesModule,
    MatBottomSheetModule,
    ],
  providers: [
    AuthGuardService,
    AuthService,
    SpringAPiService,
    CustomLoaderService,
    FacialVerificationService,
    UplaodService,
    p2pService,   
    { provide: MatBottomSheetRef, useValue: {} },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
