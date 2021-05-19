import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable()
export class ItemVariation extends Parse.Object {

  constructor() {
    super('ItemVariation');
  }

  static getInstance() {
    return this;
  }

  get name(): string {
    return this.get('name');
  }

  get isActive(): boolean {
    return this.get('isActive');
  }

}

Parse.Object.registerSubclass('ItemVariation', ItemVariation);
