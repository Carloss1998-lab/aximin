import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Category extends Parse.Object {

  constructor() {
    super('Category');
  }

  static getInstance() {
    return this;
  }

  load(params: any = {}): Promise<Category[]> {

    const query = new Parse.Query(Category);

    if (params.canonical) {
      query.contains('canonical', params.canonical);
    }

    query.equalTo('status', 'Active');
    query.ascending('name');
    query.doesNotExist('deletedAt');

    return query.find()
  }

  get name(): string {
    return this.get('name');
  }

  get status(): string {
    return this.get('status');
  }

  get slug(): string {
    return this.id + '/' + (this.get('slug') || '');
  }

  get image(): any {
    return this.get('image');
  }

  get imageThumb(): any {
    return this.get('imageThumb');
  }

  get subCategoryCount(): any {
    return this.get('subCategoryCount');
  }

}

Parse.Object.registerSubclass('Category', Category);