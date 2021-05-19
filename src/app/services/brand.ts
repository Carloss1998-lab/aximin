import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class Brand extends Parse.Object {

  constructor() {
    super('Brand');
  }

  static getInstance() {
    return this;
  }

  load(params: any = {}): Promise<Brand[]> {
    const query = new Parse.Query(Brand);

    if (Array.isArray(params.categories)) {

      const categories = params.categories.map((id: string) => {
        const obj = new Category;
        obj.id = id;
        return obj;
      });

      if (categories.length) {
        query.containedIn('categories', categories);
      }

    } else if (params.categories && typeof params.categories === 'string') {
      const category = new Category;
      category.id = params.categories;
      query.equalTo('categories', category);
    }

    query.equalTo('status', 'Active');
    query.ascending('name');
    query.doesNotExist('deletedAt');
    return query.find();
  }

  get name(): string {
    return this.get('name');
  }

  get status(): string {
    return this.get('status');
  }

  get image(): Parse.File {
    return this.get('image');
  }

  get imageThumb(): Parse.File {
    return this.get('imageThumb');
  }

}

Parse.Object.registerSubclass('Brand', Brand);