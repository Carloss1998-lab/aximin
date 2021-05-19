import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class Preference {

  private _lang: string;
  private _cartCount: string;
  private _isPushEnabled: boolean;

  get lang(): any {
    return this._lang;
  }

  set lang(val) {
    this._lang = val;
  }

  get cartCount(): any {
    return this._cartCount;
  }

  set cartCount(val) {
    this._cartCount = val;
  }

  get isPushEnabled(): any {
    return this._isPushEnabled;
  }

  set isPushEnabled(val) {
    this._isPushEnabled = val;
  }

}
