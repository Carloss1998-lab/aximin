import { Component, NgZone } from '@angular/core';

import { Platform, ToastController, AlertController, LoadingController, Config } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from './services/user';
import { environment } from 'src/environments/environment';
import { Category } from './services/category';
import { Item } from './services/item';
import { Card } from './services/card';
import { Preference } from './services/preference';
import { Cart } from './services/cart';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from './services/local-storage';
import { Installation } from './services/installation';
import { WindowRef } from './services/window-ref';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import * as Parse from 'parse';
import { Slide } from './services/slide';
import { Router } from '@angular/router';
import { StripeService } from 'ngx-stripe';
import { ItemVariation } from './services/item-variation';
import { SocialAuthService } from 'angularx-social-login';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AudioService } from './services/audio';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public user: User;

  private loader = null;
  private objWindow = null;
  private cartCount = '';

  constructor(
    private platform: Platform,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private preference: Preference,
    private loadingCtrl: LoadingController,
    private cartService: Cart,
    private statusBar: StatusBar,
    private headerColor: HeaderColor,
    private translate: TranslateService,
    private localStorage: LocalStorage,
    private userService: User,
    private windowRef: WindowRef,
    private installationService: Installation,
    private stripeService: StripeService,
    private googlePlus: GooglePlus,
    private authService: SocialAuthService,
    private audioService: AudioService,
    private ngZone: NgZone,
    private splashScreen: SplashScreen) {
    this.initializeApp();
  }

  async initializeApp() {

    this.objWindow = this.windowRef.nativeWindow;

    this.setupParse();

    this.user = User.getCurrent();

    this.setupLanguage();
    this.setupEvents();
    this.setupDesktopAnimations();

    if (this.platform.is('cordova')) {
      await this.platform.ready();
      this.setupStatusBar();
      this.setupPush();
      this.setupNativeAudio();
      this.splashScreen.hide();
      if (this.platform.is('android')) this.setupHeaderColor();
    }

  }

  setupParse() {
    (Parse as any).serverURL = environment.serverUrl;
    Parse.initialize(environment.appId);

    Slide.getInstance();
    Category.getInstance();
    Item.getInstance();
    Card.getInstance();
    ItemVariation.getInstance();

    this.loadCart();
  }

  setupNativeAudio() {

    let path = './assets/audio/pristine.mp3';

    if (this.platform.is('ios')) {
      path = './assets/audio/pristine.m4r';
    }

    this.audioService.preload('ping', path);
  }

  setupHeaderColor() {
    this.headerColor.tint(environment.androidHeaderColor);
  }

  setupDesktopAnimations() {
    if (this.platform.is('desktop')) {
      const config = new Config;
      config.set('rippleEffect', false);
      config.set('animated', false);
    }
  }

  async setupLanguage() {
    this.translate.setDefaultLang(environment.defaultLang);

    try {

      const supportedLangs = ['en', 'es', 'ar', 'fr'];
      const browserLang = navigator.language.substr(0, 2);

      let lang = await this.localStorage.getLang();

      if (lang === null && supportedLangs.indexOf(browserLang) !== -1) {
        lang = browserLang;
      }

      lang = lang || environment.defaultLang;

      if (lang === 'ar') {
        document.dir = 'rtl';
      } else {
        document.dir = 'ltr';
      }

      this.localStorage.setLang(lang);
      this.translate.use(lang);
      this.preference.lang = lang;

    } catch (error) {
      console.warn(error);
    }
  }

  setupEvents() {
    window.addEventListener('cart:updated', (e: CustomEvent) => {
      this.updateCartCount(e.detail);
    });

    window.addEventListener('cart:expired', (e: CustomEvent) => {
      const cart = e.detail;
      this.updateCartCount(cart);
      cart.save({ status: 'active' });
      this.translate.get('CART_EXPIRED')
        .subscribe(str => this.showToast(str));
    });

    window.addEventListener('user:login', (e: CustomEvent) => {
      this.user = e.detail;
      this.updateInstallation();
      this.loadCart();
    });

    window.addEventListener('user:logout', (e: CustomEvent) => {
      this.logout();
    });

    window.addEventListener('lang:change', (event: CustomEvent) => {
      this.onChangeLang(event.detail);
    });
  }

  async onChangeLang(lang: string) {
    this.translate.use(lang);
    this.preference.lang = lang;
    await this.localStorage.setLang(lang);
    window.location.reload();
  }

  setupStatusBar() {
    if (this.platform.is('ios')) {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();
    } else {
      this.statusBar.backgroundColorByHexString(environment.androidHeaderColor);
    }
  }

  async loadCart() {

    try {

      if (User.getCurrent()) {

        let cart = await this.cartService.getOne();
        cart = cart || new Cart;
        this.updateCartCount(cart);
      }

    } catch (error) {
      if (error.code === 209) {
        this.logout({ silent: true });
      }
    }

  }

  updateCartCount(cart: Cart) {
    this.cartCount = cart.items.length;
    this.preference.cartCount = this.cartCount;
  }

  async setupPush() {

    if (this.objWindow.ParsePushPlugin) {

      this.objWindow.ParsePushPlugin.resetBadge();

      this.platform.resume.subscribe(() => {
        this.objWindow.ParsePushPlugin.resetBadge();
      });

      this.objWindow.ParsePushPlugin.on('receivePN:news', (pn: any) => {
        console.log('[receivePN] News Notification:' + JSON.stringify(pn));
      });

      this.objWindow.ParsePushPlugin.on('receivePN:order', (pn: any) => {
        console.log('[receivePN] Order Notification:' + JSON.stringify(pn));
      });

      this.objWindow.ParsePushPlugin.on('receivePN', (pn: any) => {
        console.log('[receivePN] Push notification:' + JSON.stringify(pn));
        this.showNotification(pn);
        this.audioService.play('ping');
        this.objWindow.ParsePushPlugin.resetBadge();
      });

      this.objWindow.ParsePushPlugin.on('openPN', (pn: any) => {
        console.log('[openPN] Notification:' + JSON.stringify(pn));

        let page = null;
        let queryParams = null;

        if (pn.brandId) {
          page = '/1/home/items';
          queryParams = { brand: pn.brandId };
        } else if (pn.categoryId) {
          page = '/1/home/items';
          queryParams = { cat: pn.categoryId };
        } else if (pn.subcategoryId) {
          page = '/1/home/items';
          queryParams = { subcat: pn.subcategoryId };
        } else if (pn.itemId) {
          page = '/1/home/items/' + pn.itemId;
          queryParams = {};
        }

        if (page) {
          this.ngZone.run(() => {
            this.router.navigate([page], { queryParams });
          });
        }

        this.objWindow.ParsePushPlugin.resetBadge();
      });

      this.objWindow.ParsePushPlugin.initialize();

      this.updateInstallation();
    }
  }

  async updateInstallation() {

    try {

      if (this.objWindow.ParsePushPlugin) {

        let payload: any = {
          user: null
        };

        const id = await this.installationService.getId();

        const obj = await this.installationService.getOne(id);

        if (obj) {
          payload.isPushEnabled = obj.isPushEnabled;
          this.localStorage.setIsPushEnabled(obj.isPushEnabled);
          this.preference.isPushEnabled = obj.isPushEnabled;
        }

        if (this.user) {
          payload.user = this.user.toPointer();
        }

        const res = await this.installationService.save(id, payload);
        console.log('Installation updated', res);
      }

    } catch (error) {
      console.warn(error);
    }
  }

  async showNotification(notification: any) {

    const viewText = await this.translate.get('VIEW').toPromise();

    let buttons = null;

    if (notification.brandId) {
      buttons = [{
        side: 'end',
        text: viewText,
        handler: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/1/home/items'], {
              queryParams: { brand: notification.brandId }
            });
          });
        }
      }];
    } else if (notification.categoryId) {
      buttons = [{
        side: 'end',
        text: viewText,
        handler: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/1/home/items'], {
              queryParams: { cat: notification.categoryId }
            });
          });
        }
      }];
    } else if (notification.subcategoryId) {
      buttons = [{
        side: 'end',
        text: viewText,
        handler: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/1/home/items'], {
              queryParams: { subcat: notification.subcategoryId }
            });
          });
        }
      }];
    } else if (notification.itemId) {
      buttons = [{
        side: 'end',
        text: viewText,
        handler: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/1/home/items/' + notification.itemId]);
          });
        }
      }];
    }

    this.showToast(notification.alert, buttons, 5000);
  }

  async showAlert(title: string = '', message: string = '', okText: string = 'OK') {

    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [okText],
    });

    return await alert.present();
  }

  showConfirm(message: string): Promise<any> {

    return new Promise(async (resolve, reject) => {

      const str = await this.translate.get(['OK', 'CANCEL']).toPromise();

      const confirm = await this.alertCtrl.create({
        header: '',
        message: message,
        buttons: [{
          text: str.CANCEL,
          role: 'cancel',
          handler: () => reject(false),
        }, {
          text: str.OK,
          handler: () => resolve(true)
        }]
      });

      confirm.present();

    });
  }

  async showLoadingView() {

    const str = await this.translate.get('LOADING').toPromise();

    this.loader = await this.loadingCtrl.create({
      message: str
    });

    return await this.loader.present();
  }

  dismissLoadingView() {
    if (this.loader) {
      this.loader.dismiss()
        .catch((e: any) => console.log('ERROR CATCH: LoadingController dismiss', e));
    }
  }

  async showToast(message: string, buttons: any = null, duration: any = 3000) {

    const closeText = await this.translate.get('CLOSE').toPromise();

    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      color: 'primary',
      position: 'bottom',
      cssClass: 'tabs-bottom',
      buttons: buttons || [{
        text: closeText,
        role: 'cancel',
      }]
    });

    return await toast.present();
  }

  goTo(page: string) {
    this.router.navigate([page]);
  }

  async logout(ev: any = {}) {

    try {

      if (!ev.silent) {
        let str = await this.translate.get('LOGOUT_CONFIRMATION').toPromise();
        await this.showConfirm(str);
      }

      const authData = this.user.authData;

      await this.showLoadingView();
      await this.userService.logout();
      window.dispatchEvent(new CustomEvent('user:loggedOut'));
      this.user = null;
      this.goTo('/');
      this.updateCartCount(new Cart);
      this.dismissLoadingView();
      this.updateInstallation();
      this.translate.get('LOGGED_OUT').subscribe(str => this.showToast(str));

      if (this.platform.is("hybrid")) {
        if (authData && authData.google) {
          this.googlePlus.disconnect();
        }
      } else {
        if (authData && (authData.google || authData.facebook)) {
          this.authService.signOut(true);
        }
      }

    } catch (err) {
      this.dismissLoadingView();
    }
  }
}
