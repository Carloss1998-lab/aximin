import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService extends Parse.Object {

  constructor() {
    super('AppConfig');
  }

  load(): Promise<AppConfigService> {
    return Parse.Cloud.run('getAppConfig');
  }

  get about(): any {
    return this.get('about');
  }

  get admin(): any {
    return this.get('admin');
  }

  get layout(): any {
    return this.get('layout');
  }

  get auth(): any {
    return this.get('auth');
  }
}

Parse.Object.registerSubclass('AppConfig', AppConfigService);