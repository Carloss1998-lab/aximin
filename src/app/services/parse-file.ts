import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class ParseFile {

  constructor() {
  }

  upload(data: any, isBase64: boolean = true) {
    const file = isBase64 ? { base64: data } : data;
    return new Parse.File('image.jpg', file).save();
  }
}
