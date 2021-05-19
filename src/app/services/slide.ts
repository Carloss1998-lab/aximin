import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Slide extends Parse.Object {

  constructor() {
    super('SlideImage');
  }

  static getInstance() {
    return this;
  }

  get image(): any {
    return this.get('image');
  }

  get item(): any {
    return this.get('item');
  }

  get brand(): any {
    return this.get('brand');
  }

  get category(): any {
    return this.get('category');
  }

  get subcategory(): any {
    return this.get('subcategory');
  }

  get url(): any {
    return this.get('url');
  }

  get sort(): number {
    return this.get('sort');
  }

  get isActive(): boolean {
    return this.get('isActive');
  }

  toString(): string {
    return this.image.url();
  }
}

Parse.Object.registerSubclass('SlideImage', Slide);