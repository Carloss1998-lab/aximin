import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class SubCategory extends Parse.Object {

  constructor() {
    super('SubCategory');
  }

  load(params: any = {}): Promise<SubCategory[]> {

    const query = new Parse.Query(SubCategory);

    if (params.category) {
      query.equalTo('category', params.category);
    }

    if (params.canonical) {
      query.contains('canonical', params.canonical);
    }

    query.equalTo('status', 'Active');
    query.include('category');
    query.ascending('name');
    query.doesNotExist('deletedAt');

    return query.find();
  }

  count(params: any = {}): Promise<number> {

    const query = new Parse.Query(SubCategory);

    if (params.category) {
      query.equalTo('category', params.category);
    }

    if (params.canonical) {
      query.contains('canonical', params.canonical);
    }

    query.equalTo('status', 'Active');
    query.doesNotExist('deletedAt');

    return query.count();
  }

  get name(): string {
    return this.get('name');
  }

  get status(): string {
    return this.get('status');
  }

  get category(): any {
    return this.get('category');
  }

  get imageThumb(): any {
    return this.get('imageThumb');
  }

  get image(): any {
    return this.get('image');
  }

  get slug(): string {
    return this.id + '/' + this.get('slug');
  }
}

Parse.Object.registerSubclass('SubCategory', SubCategory);