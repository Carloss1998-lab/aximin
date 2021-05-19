import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Page extends Parse.Object {

  constructor() {
    super('Page');
  }

  static getInstance() {
    return this;
  }

  load(): Promise<Page[]> {
    const query = new Parse.Query(Page);
    query.equalTo('status', 'Active');
    query.ascending('title');
    query.doesNotExist('deletedAt');
    return query.find();
  }

  loadOne(id: string): Promise<Page> {
    const query = new Parse.Query(Page);
    query.equalTo('status', 'Active');
    query.doesNotExist('deletedAt');
    return query.get(id);
  }

  get title(): string {
    return this.get('title');
  }

  get content(): string {
    return this.get('content');
  }

  get slug(): string {
    return this.id + '/' + this.get('slug');
  }

}

Parse.Object.registerSubclass('Page', Page);