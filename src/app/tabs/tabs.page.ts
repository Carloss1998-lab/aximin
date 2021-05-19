import { Component, ViewChild } from '@angular/core';
import { Platform, IonTabs } from '@ionic/angular';
import { Preference } from '../services/preference';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage {

  @ViewChild(IonTabs) tabs: IonTabs;

  resetStackTabs = ['home', 'browse', 'cart', 'account'];

  handleTabClick = (event: MouseEvent) => {
    const { tab } = event.composedPath().find((element: any) =>
      element.tagName === 'ION-TAB-BUTTON') as EventTarget & { tab: string };

    let deep = 1;
    let canGoBack = false;

    const deepFn = () => {
      if (this.tabs.outlet.canGoBack(deep, tab)) {
        canGoBack = true;
        deep++;
        deepFn();
      }
    }

    deepFn();

    if (this.resetStackTabs.includes(tab) && canGoBack) {
      event.stopImmediatePropagation();
      return this.tabs.outlet.pop(deep - 1, tab);
    }
  }

  constructor(public platform: Platform,
    public preference: Preference) { }
}
