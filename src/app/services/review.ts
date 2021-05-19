import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { Item } from './item';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class Review extends Parse.Object {

  constructor() {
    super('Review');
  }

  static getInstance() {
    return this;
  }

  load(params: any = {}): Promise<Review[]> {

    const query = new Parse.Query(Review);

    if (params.item) {
      query.equalTo('item', params.item);
    }

    if (params.user) {
      query.equalTo('user', params.user);
    }
    
    query.descending('createdAt');
    query.include(['user', 'item']);
    query.doesNotExist('deletedAt');
    query.equalTo('status', 'Published');

    const limit = params.limit || 100;
    const page = params.page || 0;
    query.skip(page * limit);
    query.limit(limit);

    return query.find();
  }

  get rating(): number {
    return this.get('rating');
  }

  set rating(val: number) {
    this.set('rating', val);
  }

  get comment(): string {
    return this.get('comment');
  }

  set comment(val: string) {
    this.set('comment', val);
  }

  get item(): Item {
    return this.get('item');
  }

  set item(val: Item) {
    this.set('item', val);
  }

  get user(): User {
    return this.get('user');
  }
}

Parse.Object.registerSubclass('Review', Review);
