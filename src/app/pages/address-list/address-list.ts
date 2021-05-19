import { Component, Injector } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { CustomerAddress } from '../../services/customer-address';
import { AddressAddPage } from '../address-add/address-add';

@Component({
  selector: 'page-address-list',
  templateUrl: 'address-list.html',
  styleUrls: ['address-list.scss']
})
export class AddressListPage extends BasePage {

  public addresses: CustomerAddress[] = [];

  constructor(injector: Injector,
    private customerAddressService: CustomerAddress) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

  async ionViewDidEnter() {

    if (!this.addresses.length) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }

    const title = await this.getTrans('ADDRESSES');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
    
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

  async onDeleteAddress(address: CustomerAddress) {

    try {

      const str = await this.translate.get('DELETE_CONFIRMATION').toPromise();

      const res = await this.showConfirm(str);

      if (!res) return;
  
      await this.showLoadingView({ showOverlay: false });
  
      await address.destroy();
  
      let index = this.addresses.indexOf(address);
      if (index !== -1) this.addresses.splice(index, 1);

      if (this.addresses.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }
      
      this.translate.get('DELETED').subscribe(str => this.showToast(str));
      
    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

  }

  async onAddButtonTouched() {

    await this.showLoadingView({ showOverlay: true });
    
    const modal = await this.modalCtrl.create({
      component: AddressAddPage
    });
    
    await modal.present();

    this.dismissLoadingView();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      this.addresses.unshift(data);
      this.showContentView();
    }
  }

}
