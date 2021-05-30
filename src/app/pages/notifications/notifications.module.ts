import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { SharedModule } from '../../shared.module';
import { NotificationsPage } from './notifications';

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: NotificationsPage
      }
    ]),
    SharedModule
  ,MomentModule],
})
export class NotificationsPageModule {}
