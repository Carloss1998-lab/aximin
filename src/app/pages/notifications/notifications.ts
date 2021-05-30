import { Component,Injector } from '@angular/core';
import {Notification} from '../../services/notification';
import { BasePage } from '../base-page/base-page';
import * as Parse from 'parse';
import { AppComponent } from 'src/app/app.component';
import { Console } from 'console';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
  styleUrls: ['notifications.scss'],
})


export class NotificationsPage extends BasePage {

  public notifications: Notification[] = [];
  public notificationsUpdate: Notification;
  public resetNotification : AppComponent
  constructor(injector: Injector,
    private notificationsService: Notification,
    private resetNotificationService: AppComponent) {
    super(injector);
  }
  //.updateNotificationsCount([])
  enableMenuSwipe() {
    return false;
  }

  ionViewDidEnter() {

    if (!this.notifications.length) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }
    
  }

  async loadData(event: any = {}) {

    try {
      this.resetNotificationService.updateNotificationsCount([])
      this.refresher = event.target;
  
      this.notifications = await this.notificationsService.load();
      
      //console.log("ICI1");

      //this.notificationsUpdate = await this.notificationsService.loadOne("83BkJIOF5F");
      //console.log(this.notificationsUpdate);

      //await this.notificationsUpdate.markAsSeenNotif();
      //console.log("ICI");

     function IsCurrentUser(element) {
      return (element["users"]["0"].id == Parse.User.current().id); 
   }
      this.notifications = this.notifications.filter(IsCurrentUser);

// Change read = true

      //console.log("Code");
      //this.notificationsUpdate = await this.notificationsService.loadOne(element.id);
      //await this.notificationsUpdate.markAsSeenNotif();
      //console.log("marche")

      for (var element of this.notifications) {
        if (element["read"]==false) {
          this.notificationsUpdate = await this.notificationsService.loadOne(element.id);
          await this.notificationsUpdate.markAsSeenNotif();
        }
      }

      if (this.notifications.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();
      
    } catch (error) {
      this.showErrorView();
      this.onRefreshComplete();
      this.translate.get('ERROR_NETWORK').subscribe((str) => this.showToast(str));
    }
  }
}

