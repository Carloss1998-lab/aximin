import { Component, Injector, ViewChild } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { Order } from '../../services/order';
import { ReviewAddPage } from '../review-add/review-add';
import { Observable, Subject, merge } from 'rxjs';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'page-order-detail-page',
  templateUrl: 'order-detail-page.html',
  styleUrls: ['order-detail-page.scss']
})
export class OrderDetailPage extends BasePage {

  public order: Order;

  constructor(injector: Injector, private orderService: Order) {
    super(injector);
  }

  ngOnInit() {}

  async ionViewDidEnter() {

    try {

      await this.showLoadingView({ showOverlay: false });
  
      const orderId = await this.getParams().id;
      this.order = await this.orderService.loadOne(orderId);

      this.showContentView();
      
    } catch (error) {
      this.showErrorView();
    }

  }

  enableMenuSwipe(): boolean {
    return false;
  }

  async onPresentReviewAddModal(item: any) {

    await this.showLoadingView({ showOverlay: true });

    const order = this.order;

    const modal = await this.modalCtrl.create({
      component: ReviewAddPage,
      componentProps: { item, order }
    });

    await modal.present();

    this.showContentView();
  }

  formatBrand() {

    if (this.order && this.order.card) {
      return this.order.card.brand.toLowerCase().replace(' ', '_')
    }

    return '';
    
  }

  async onMarkAsReceived() {
    try {

      let str = await this.getTrans('CONFIRM_MARK_AS_RECEIVED');
      
      const res = await this.showConfirm(str);

      if (!res) return;

      await this.showLoadingView({ showOverlay: true });

      await this.order.markAsDelivered();

      this.showContentView();
      
    } catch (error) {
      this.showContentView();
    }
  }

}
