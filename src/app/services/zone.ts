import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Zone extends Parse.Object {

  constructor() {
    super('Zone');
  }

  load(params: any = {}): Promise<Zone[]> {

    const query = new Parse.Query(Zone);

    if (params.type) {
      query.equalTo('type', params.type)
    }

    if (params.parent) {
      query.equalTo('parent', params.parent)
    }

    query.ascending('name');
    query.equalTo('isActive', true);
    query.doesNotExist('deletedAt');
    return query.find();
  }

  get name(): string {
    return this.get('name');
  }

  get fee(): number {
    return this.get('fee');
  }

  toString(): string {
    return this.name;
  }

}

Parse.Object.registerSubclass('Zone', Zone);

