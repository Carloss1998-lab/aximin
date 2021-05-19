import { Component, Injector, ViewChild } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { Order } from '../../services/order';
import { Observable, Subject, merge } from 'rxjs';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'page-order-list-page',
  templateUrl: 'order-list-page.html',
  styleUrls: ['order-list-page.scss']
})
export class OrderListPage extends BasePage {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public orders: Order[] = [];

  public loadAndScroll: Observable<any>;
  protected contentLoaded: Subject<any>;

  constructor(injector: Injector,
    private orderService: Order) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ngOnInit() {
    this.contentLoaded = new Subject();

    this.loadAndScroll = merge(
      this.content.ionScroll,
      this.contentLoaded
    );
  }

  async ionViewDidEnter() {

    if (!this.orders.length) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }

    const title = await this.getTrans('MY_ORDERS');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
    
  }

  async loadData(event: any = {}) {

    try {

      this.refresher = event.target;

      this.orders = await this.orderService.load();
  
      if (this.orders.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete(this.orders);

      setTimeout(() => {
        this.contentLoaded.next();
      }, 400);
      
    } catch (error) {
      this.translate.get('ERROR_NETWORK').subscribe((str) => this.showToast(str));
      this.showErrorView();
    }

  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
