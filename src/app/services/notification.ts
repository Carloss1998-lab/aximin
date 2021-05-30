import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { Brand } from './brand';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})

export class Notification  extends Parse.Object {

  constructor() {
    super('Notification');
  }
  

  load(params: any = {}): Promise<Notification[]> { 
    const query = new Parse.Query(Notification);
    const users = Parse.User.current().id;
   // query.equalTo('read', false);
     query.descending('createdAt')
     return query.find();
  }

  markAsSeenNotif(): Promise<Notification> {
    const id = this.id;
    return Parse.Cloud.run('markNotificationAsSeen', { id });
  }

  loadOne(id: string): Promise<Notification> {
    const query = new Parse.Query(Notification);
    return query.get(id);
  }
 
  get users(): any {
    return this.get('users');
  }

  get message(): string {
    return this.get('message');
  }
  get createdAt(): Date {
    return this.get('createdAt');
  }
  get read(): any {
    return this.get('read');
  }
    get customer(): any {
    return this.get('customer');
  }
  get objectId(): any {
    return this.get('id');
  }

}

Parse.Object.registerSubclass('Notification', Notification);

