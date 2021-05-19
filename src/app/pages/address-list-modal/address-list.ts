import { Component, Injector } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { CustomerAddress } from '../../services/customer-address';
import { AddressAddPage } from '../address-add/address-add';

@Component({
  selector: 'page-address-list',
  templateUrl: 'address-list.html',
  styleUrls: ['address-list.scss']
})
export class AddressListModalPage extends BasePage {

  public addresses: CustomerAddress[] = [];

  constructor(injector: Injector,
    private customerAddressService: CustomerAddress) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewDidEnter() {

    if (!this.addresses.length) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }
    
  }

  async loadData(event: any = {}) {

    try {

      this.refresher = event.target;
  
      this.addresses = await this.customerAddressService.load();
      
      if (this.addresses.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();
      
    } catch (error) {
      this.showErrorView();
      this.onRefreshComplete();
      this.translate.get('ERROR_NETWORK').subscribe((str) => this.showToast(str));
    }
  }

  onAddressTouched(address: CustomerAddress) {
    this.onDismiss(address);
  }

  onDismiss(address: CustomerAddress = null) {
    this.modalCtrl.dismiss(address);
  }

  async onAddButtonTouched() {

    await this.showLoadingView({ showOverlay: true });
    
    const modal = await this.modalCtrl.create({
      component: AddressAddPage
    });
    
    await modal.present();

    this.showContentView();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      this.addresses.unshift(data);
      this.showContentView();
    }
  }

}
