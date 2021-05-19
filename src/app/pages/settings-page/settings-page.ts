import { Component, Injector } from '@angular/core';
import { LocalStorage } from '../../services/local-storage';
import { BasePage } from '../base-page/base-page';
import { Installation } from '../../services/installation';

@Component({
  selector: 'page-settings-page',
  templateUrl: 'settings-page.html',
  styleUrls: ['settings-page.scss']
})
export class SettingsPage extends BasePage {

  constructor(injector: Injector,
    private installationService: Installation,
    private storage: LocalStorage) {
    super(injector);
  }

  enableMenuSwipe() {
    return true;
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

  async onChangeIsPushEnabled(event: CustomEvent) {

    if (!event) return;

    const isPushEnabled = event.detail.checked;

    try {

      const id = await this.installationService.getId();

      await this.installationService.save(id, {
        isPushEnabled: isPushEnabled
      });

      this.storage.setIsPushEnabled(isPushEnabled);
      this.preference.isPushEnabled = isPushEnabled;

    } catch (error) {
      console.warn(error);
    }

  }

  onChangeLang(event: CustomEvent) {

    if (!event) return;

    const lang = event.detail.value;
    window.dispatchEvent(new CustomEvent("lang:change", { detail: lang }));
  }

}
