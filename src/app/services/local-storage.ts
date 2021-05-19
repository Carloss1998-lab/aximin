import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorage {

  constructor(private storage: Storage) {
  }

  getLang(): Promise<string> {
    return this.storage.get('lang');
  }

  setLang(val: string) {
    return this.storage.set('lang', val);
  }

  getIsPushEnabled(): Promise<boolean> {
    return this.storage.get('isPushEnabled');
  }

  setIsPushEnabled(val: boolean) {
    return this.storage.set('isPushEnabled', val);
  }

}
