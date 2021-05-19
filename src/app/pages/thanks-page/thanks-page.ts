import { Component, Injector } from '@angular/core';
import { Order } from '../../services/order';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'page-thanks-page',
  templateUrl: 'thanks-page.html',
  styleUrls: ['thanks-page.scss']
})
export class ThanksPage extends BasePage {

  public order: Order;

  constructor(injector: Injector, private orderService: Order) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return true;
  }

  async ionViewDidEnter() {

    try {

      await this.showLoadingView({ showOverlay: false });
  
      const orderId = await this.getParams().orderId;
      this.order = await this.orderService.loadOne(orderId);

      this.showContentView();
      
    } catch (error) {
      this.showErrorView();
    }

    const title = await this.getTrans('APP_NAME');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });

  }

  async goToHome() {
    await this.setRoot('/1/cart');
    this.navigateTo('/');
  }

  async goToOrder() {
    await this.setRoot('/1/cart');
    this.navigateTo('/1/account/orders/' + this.order.id);
  }

}
