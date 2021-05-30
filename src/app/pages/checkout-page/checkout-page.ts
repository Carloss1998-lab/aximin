import { Component, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasePage } from '../base-page/base-page';
import { Cart } from '../../services/cart';
import { Order } from '../../services/order';
import { User } from '../../services/user';
import { CustomerAddress } from '../../services/customer-address';
import { Card } from '../../services/card';
import { AppConfigService } from 'src/app/services/app-config';
import { CurrencyGlobalPipe } from 'src/app/pipes/currency-global';
import { AddressAddPage } from '../address-add/address-add';
import { CardAddPage } from '../card-add/card-add';
import { SignInPage } from '../sign-in/sign-in';

@Component({
  selector: 'checkout-page',
  templateUrl: './checkout-page.html',
  styleUrls: ['./checkout-page.scss'],
  providers: [CurrencyGlobalPipe],
})
export class CheckoutPage extends BasePage {

  public cart: Cart;
  public form: FormGroup;

  public isCreatingOrder: boolean;

  public isCodEnabled: boolean;
  public isCardEnabled: boolean;

  public minimumOrderAmount: number;
  public maximumOrderAmount: number;

  public isUpdatingCart: boolean;

  public addresses: CustomerAddress[] = [];
  public cards: Card[] = [];

  public loginListener: any;

  get shippingField() {
    return this.form.get('shipping');
  }

  get paymentMethodField() {
    return this.form.get('paymentMethod');
  }

  get contactEmailField() {
    return this.form.get('contactEmail');
  }

  get cardField() {
    return this.form.get('card');
  }

  constructor(injector: Injector,
    private cardService: Card,
    private cartService: Cart,
    private appConfig: AppConfigService,
    private currencyGlobalPipe: CurrencyGlobalPipe,
    private customerAddressService: CustomerAddress) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
  }


  enableMenuSwipe(): boolean {
    return false;
  }

  setupEvents() {
    this.loginListener = () => this.onPlaceOrder();
    document.addEventListener('user:login', this.loginListener);
  }

  setupForm() {

    const user = User.getCurrent();
    const contactEmail = user.email || user.contactEmail;

    this.form = new FormGroup({
      shipping: new FormControl(null, Validators.required),
      contactEmail: new FormControl(contactEmail, [
        Validators.required,
        Validators.email,
      ]),
      card: new FormControl(null),
      paymentMethod: new FormControl('', Validators.required),
      couponCode: new FormControl(''),
    });
  }

  async ionViewDidEnter() {

    this.setupEvents();

    if (User.getCurrent()) {
      this.showLoadingView({ showOverlay: false });
      this.loadCart();
      
    } else {
      this.showEmptyView();
    }

    const title = await this.getTrans('CHECKOUT');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  ionViewDidLeave() {
    document.removeEventListener('user:login', this.loginListener);
  }

  async onRemoveCoupon() {
    try {

      this.isUpdatingCart = true;
      const cart = await this.cart.removeCoupon();
      this.cart = cart;
      this.isUpdatingCart = false;

      this.translate.get('COUPON_REMOVED')
        .subscribe(str => this.showToast(str));

    } catch (error) {
      this.isUpdatingCart = false;

      this.translate.get('ERROR_NETWORK')
        .subscribe(str => this.showToast(str));
    }
  }

  async onApplyCouponButtonTouched() {

    const couponCode = (this.form.value.couponCode || '').trim();

    if (!couponCode) return;

    try {

      this.isUpdatingCart = true;
      const cart = await this.cart.applyCoupon(couponCode);
      this.cart = cart;
      this.isUpdatingCart = false;

      this.translate.get('COUPON_CODE_APPLIED')
        .subscribe(str => this.showToast(str));

    } catch (error) {
      this.isUpdatingCart = false;
      this.showCouponErrorsIfNeeded(error);
    }

  }

  showCouponErrorsIfNeeded(error: any) {
    if (error.code === 5000) {
      this.translate.get('COUPON_NOT_FOUND')
        .subscribe(str => this.showToast(str));
    } else if (error.code === 5001) {
      this.translate.get('COUPON_INACTIVE')
        .subscribe(str => this.showToast(str));
    } else if (error.code === 5002) {
      this.translate.get('COUPON_USAGE_LIMIT_REACHED')
        .subscribe(str => this.showToast(str));
    } else if (error.code === 5003) {
      this.translate.get('COUPON_NOT_STARTED_YET')
        .subscribe(str => this.showToast(str));
    } else if (error.code === 5004) {
      this.translate.get('COUPON_EXPIRED')
        .subscribe(str => this.showToast(str));
    } else if (error.code === 5005) {
      this.translate.get('COUPON_USAGE_LIMIT_PER_USER_REACHED')
        .subscribe(str => this.showToast(str));
    } else if (error.code === 5006) {

      const matches = error.message.match(/\%(.*?)\%/);

      if (matches) {
        const value = matches[1];
        const formattedValue = this.currencyGlobalPipe.transform(value);
        this.translate.get('ERROR_MINIMUM_AMOUNT_COUPON', { value: formattedValue })
          .subscribe(str => this.showToast(str));
      }

    } else if (error.code === 5007) {

      const matches = error.message.match(/\%(.*?)\%/);

      if (matches) {
        const value = matches[1];
        const formattedValue = this.currencyGlobalPipe.transform(value);
        this.translate.get('ERROR_MAXIMUM_AMOUNT_COUPON', { value: formattedValue })
          .subscribe(str => this.showToast(str));
      }

    } else if (
      error.code === 5008 ||
      error.code === 5009 ||
      error.code === 5010 ||
      error.code === 5011 ||
      error.code === 5012 ||
      error.code === 5013 ||
      error.code === 5014 ||
      error.code === 5015 ||
      error.code === 5016) {
      this.translate.get('CANNOT_APPLY_COUPON')
        .subscribe(str => this.showToast(str));
    } else {
      this.translate.get('ERROR_NETWORK')
        .subscribe(str => this.showToast(str));
    }
  }

  async loadCart() {

    try {

      const appConfig = await this.appConfig.load();

      this.isCardEnabled = appConfig.admin?.isCardEnabled;
      this.isCodEnabled = appConfig.admin?.isCodEnabled;

      this.minimumOrderAmount = appConfig.admin?.minimumOrderAmount;
      this.maximumOrderAmount = appConfig.admin?.maximumOrderAmount;

      this.cart = await this.cartService.getOne();

      if (this.cart && this.cart.status === 'expired') {
        window.dispatchEvent(new CustomEvent('cart:expired', {
          detail: this.cart
        }));
        return this.goBack();
      }

      if (this.cart && !this.cart.empty()) {

        this.addresses = await this.customerAddressService.load();

        if (this.cart.shipping && this.addresses.length) {
          const shipping = this.addresses.find(address => {
            return address.id === this.cart.shipping.id
          });
          this.form.controls.shipping.setValue(shipping)
          this.onChangeAddress();
        } else if (this.addresses.length) {
          this.form.controls.shipping.setValue(this.addresses[0]);
          this.onChangeAddress();
        }

        this.cards = await this.cardService.load();

        if (this.cards.length) {
          const card = this.cards[0];
          this.form.controls.card.setValue(card);
        }

        this.showContentView();
      } else {
        this.showEmptyView();
      }

    } catch (error) {
      this.showErrorView();
      this.translate.get('ERROR_NETWORK')
        .subscribe(str => this.showToast(str));
    }
  }

  async onPresentCardAddModal() {
    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: CardAddPage,
    });

    await modal.present();

    this.showContentView();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.cards = [data, ...this.cards];
      this.form.controls.card.setValue(data);
    }
  }

  async onPresentAddressAddModal() {
    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: AddressAddPage,
    });

    await modal.present();

    this.showContentView();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.addresses = [data, ...this.addresses];
      this.form.controls.shipping.setValue(data);
    }
  }

  async onChangeAddress() {
    try {
      this.isUpdatingCart = true;
      await this.cart.save({
        shipping: this.shippingField.value
      });
      this.isUpdatingCart = false;
    } catch {
      this.isUpdatingCart = false;
    }
  }

  onChangePaymentMethod(event: any = {}) {

    const paymentMethod = event.target.value;

    if (paymentMethod === 'Cash') {
      this.form.controls.card.clearValidators();
      this.form.controls.card.setValue(null);
      this.form.controls.card.updateValueAndValidity();
    } else if (paymentMethod === 'Card') {
      this.form.controls.card.setValidators(Validators.required);
      this.form.controls.card.updateValueAndValidity();
    }
  }

  prepareOrderData(): Order {

    const formData = Object.assign({}, this.form.value);

    const order = new Order;

    order.paymentMethod = formData.paymentMethod;
    order.card = formData.card;
    order.contact = { email: formData.contactEmail };

    return order;
  }

  async onPresentSignUpModal() {

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SignInPage,
      componentProps: {
        showSignUpForm: true
      }
    });

    await modal.present();

    this.showContentView();
  }

  async onPlaceOrder() {

    try {

      if (this.form.controls['contactEmail'].hasError('required')) {
        const message = await this.getTrans('CHECKOUT_EMAIL_REQUIRED');
        return this.showToast(message);
      } else if (this.form.controls['contactEmail'].hasError('email')) {
        const message = await this.getTrans('CHECKOUT_EMAIL_INVALID');
        return this.showToast(message);
      } else if (this.form.controls['shipping'].hasError('required')) {
        const message = await this.getTrans('CHECKOUT_ADDRESS_REQUIRED');
        return this.showToast(message);
      } else if (this.form.controls['paymentMethod'].hasError('required')) {
        const message = await this.getTrans('CHECKOUT_PAYMENT_METHOD_REQUIRED');
        return this.showToast(message);
      } else if (this.form.controls['card'].hasError('required')) {
        const message = await this.getTrans('CHECKOUT_CARD_REQUIRED');
        return this.showToast(message);
      } else if (this.form.invalid) {
        return this.translate.get('INVALID_FORM')
          .subscribe(str => this.showToast(str));
      }

      this.isCreatingOrder = true;

      const order = this.prepareOrderData();
      await order.save();

      this.isCreatingOrder = false;

      window.dispatchEvent(new CustomEvent('cart:updated', {
        detail: new Cart
      }));

      this.setRelativeRoot('./thanks/' + order.id);

    } catch (error) {

      if (error.code === 1001) {
        this.translate.get('ACCOUNT_BLOCKED').subscribe((str) => this.showToast(str));
      } else if (error.code === 1002) {
        this.translate.get('CARD_DECLINED').subscribe((str) => this.showToast(str));
      } else if (error.code === 1004) {

        const matches = error.message.match(/\%(.*?)\%/);

        if (matches) {
          const value = matches[1];
          const formattedValue = this.currencyGlobalPipe.transform(value);
          this.translate.get('ERROR_MINIMUM_ORDER_AMOUNT', { value: formattedValue })
            .subscribe(str => this.showToast(str));
        }

      } else if (error.code === 1005) {

        const matches = error.message.match(/\%(.*?)\%/);

        if (matches) {
          const value = matches[1];
          const formattedValue = this.currencyGlobalPipe.transform(value);
          this.translate.get('ERROR_MAXIMUM_ORDER_AMOUNT', { value: formattedValue })
            .subscribe(str => this.showToast(str));
        }

      } else if (error.code === 1006) {
        this.onPresentSignUpModal();
        this.translate.get('ERROR_CHECKOUT_GUEST_DISABLED')
          .subscribe(str => this.showToast(str, 'top'));
      } else {
        this.showCouponErrorsIfNeeded(error);
      }

      this.isCreatingOrder = false;
    }

  }

}
