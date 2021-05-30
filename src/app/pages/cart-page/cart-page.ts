import { Component, Injector, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Cart } from '../../services/cart';
import { User } from '../../services/user';
import { Subject, Observable, merge } from 'rxjs';
@Component({
  selector: 'cart-page',
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.scss']
})
export class CartPage extends BasePage {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public cart: Cart;
  public isSavingCart: boolean;

  protected contentLoaded: Subject<any>;
  protected loadAndScroll: Observable<any>;

  public subtotal = 0;

  constructor(injector: Injector,
    private cartService: Cart) {

    super(injector);
    window.addEventListener('user:loggedOut', () => {
      this.cart = null;
      this.showEmptyView();
    });

    window.addEventListener('user:login', () => {
      this.loadData();
    });

    this.contentLoaded = new Subject();

  }

  enableMenuSwipe(): boolean {
    return true;
  }

  ngOnInit() {
    this.setupObservable();
  }

  ionViewWillEnter() {
    if (this.content) {
      this.content.scrollToTop();
    }
  }

  async ionViewDidEnter() {

    if (User.getCurrent()) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    } else {
      this.showEmptyView();
    }

    const title = await this.getTrans('CART');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  setupObservable() {
    this.loadAndScroll = merge(
      this.content.ionScroll,
      this.contentLoaded
    );
  }

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 400);
  }

  async loadData(event: any = {}) {

    try {

      this.refresher = event.target;

      this.cart = await this.cartService.getOne();

      if (this.cart && !this.cart.empty()) {
        this.showContentView();
        this.subtotal = this.cart.subtotal;
      } else {
        this.showEmptyView();
      }

      if (this.cart && this.cart.status === 'expired') {
        this.onCartExpired(this.cart);
      }

      this.onContentLoaded();

      this.onRefreshComplete(this.cart);
      
    } catch (error) {
      this.showErrorView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }
  }

  incrementQuantity(item: any) {
    item.qty = item.qty + 1;
    item.amount = item.qty * (item.salePrice || item.price);
    this.subtotal = this.cart.calculateSubtotal();
  }

  decrementQuantity(item: any) {

    if (item.qty > 1) {
      item.qty = item.qty - 1;
      item.amount = item.qty * (item.salePrice || item.price);
      this.subtotal = this.cart.calculateSubtotal();
    } else {
      this.onRemoveItem(item);
    }
  }

  onItemTouched(item: any) {
    this.navigateToRelative('./items/' + item.objectId + '/' + item.slug);
  }

  async onRemoveItem(item: any) {

    try {

      let str = await this.getTrans('DELETE_CONFIRMATION');
      
      const res = await this.showConfirm(str);

      if (!res) return;

      await this.showLoadingView({ showOverlay: false });

      let index: number = this.cart.items.indexOf(item);
      if (index !== -1) {
        this.cart.items.splice(index, 1);
      }

      await this.cart.save();

      if (this.cart.empty()) {
        this.subtotal = 0;
        this.showEmptyView();
      } else {
        this.subtotal = this.cart.calculateSubtotal();
        this.showContentView();
      }

      window.dispatchEvent(new CustomEvent('cart:updated', {
        detail: this.cart
      }));
      
    } catch (error) {
      this.showContentView();
    }

  }

  onCartExpired(cart: Cart) {
    this.subtotal = 0;
    this.showEmptyView();
    window.dispatchEvent(new CustomEvent('cart:expired', {
      detail: cart
    }));
  }

  async goToCheckout() {

    try {
      
      if (this.cart.dirty()) {
        this.isSavingCart = true;
        await this.cart.save();
        this.isSavingCart = false;
      }

      if (this.cart.status === 'expired') {
        this.onCartExpired(this.cart);
      } else {
        this.navigateToRelative('./checkout');
      }
      
    } catch (error) {
      this.isSavingCart = false;
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

  }

}
