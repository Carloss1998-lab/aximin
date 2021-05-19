import { Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  LoadingController, NavController, ToastController, ModalController, AlertController, IonRefresher, IonInfiniteScroll, Platform,
} from '@ionic/angular';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Preference } from '../../services/preference';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
export abstract class BasePage {

  public isErrorViewVisible: boolean;
  public isEmptyViewVisible: boolean;
  public isContentViewVisible: boolean;
  public isLoadingViewVisible: boolean;
  public isAuthViewVisible: boolean;

  public preference: Preference;

  protected activatedRoute: ActivatedRoute;
  protected router: Router;
  private meta: Meta;
  private title: Title;

  protected refresher: IonRefresher;
  protected infiniteScroll: IonInfiniteScroll;
  protected translate: TranslateService;
  protected sanitizer: DomSanitizer;
  protected modalCtrl: ModalController;

  private loader: any;
  private navCtrl: NavController;
  private toastCtrl: ToastController;
  private loadingCtrl: LoadingController;
  private alertCtrl: AlertController;
  private inAppBrowser: InAppBrowser;
  private platform: Platform;
  private safariViewController: SafariViewController;

  constructor(injector: Injector) {
    this.router = injector.get(Router);
    this.activatedRoute = injector.get(ActivatedRoute);
    this.navCtrl = injector.get(NavController);
    this.loadingCtrl = injector.get(LoadingController);
    this.toastCtrl = injector.get(ToastController);
    this.alertCtrl = injector.get(AlertController);
    this.translate = injector.get(TranslateService);
    this.sanitizer = injector.get(DomSanitizer);
    this.preference = injector.get(Preference);
    this.modalCtrl = injector.get(ModalController);
    this.inAppBrowser = injector.get(InAppBrowser);
    this.platform = injector.get(Platform);
    this.safariViewController = injector.get(SafariViewController);

    this.meta = injector.get(Meta);
    this.title = injector.get(Title);
  }

  abstract enableMenuSwipe(): boolean;

  public get currency(): {
    code: string,
    display: string,
    digitsInfo: string } {
    return environment.currency;
  }

  public get serverUrl(): string {
    return environment.serverUrl;
  }

  public get appUrl(): string {
    return environment.appUrl;
  }

  public get appId(): string {
    return environment.appId;
  }

  public get stripePublicKey(): string {
    return environment.serverUrl;
  }

  public get appImageUrl(): string {
    return environment.appImageUrl;
  }

  public setPageTitle(title: string): void {
    this.title.setTitle(title);
  }

  public async setMetaTags(config1: {
    title?: string,
    description?: string,
    image?: string,
    slug?: string
  }) {

    const str = await this.getTrans(['APP_NAME', 'APP_DESCRIPTION']);

    const config = {
      title: str.APP_NAME,
      description: str.APP_DESCRIPTION,
      image: this.appImageUrl,
      ...config1
    };

    let url = this.router.url;

    if (config.slug) {
      url = this.appUrl + '/' + config.slug
    }

    this.meta.updateTag({
      property: 'og:title',
      content: config.title
    });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description
    });

    this.meta.updateTag({
      property: 'og:image',
      content: config.image
    });

    this.meta.updateTag({
      property: 'og:image:alt',
      content: config.title
    });

    this.meta.updateTag({
      property: 'og:url',
      content: url
    });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: config.title
    });

    this.meta.updateTag({
      name: 'twitter:text:title',
      content: config.title
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: config.image
    });

    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: config.title
    });
  }

  async showLoadingView(params: { showOverlay: boolean }) {

    if (params.showOverlay) {
      const loadingText = await this.getTrans('LOADING');

      this.loader = await this.loadingCtrl.create({
        message: loadingText
      });

      return await this.loader.present();

    } else {

      this.isAuthViewVisible = false;
      this.isErrorViewVisible = false;
      this.isEmptyViewVisible = false;
      this.isContentViewVisible = false;
      this.isLoadingViewVisible = true;
    }

    return true;
  }

  async dismissLoadingView() {
    if (!this.loader) return;

    try {
      return await this.loader.dismiss()
    } catch (error) {
      console.log('ERROR: LoadingController dismiss', error);
    }
  }

  showContentView() {

    this.isAuthViewVisible = false;
    this.isErrorViewVisible = false;
    this.isEmptyViewVisible = false;
    this.isLoadingViewVisible = false;
    this.isContentViewVisible = true;

    this.dismissLoadingView();
  }

  showEmptyView() {

    this.isAuthViewVisible = false;
    this.isErrorViewVisible = false;
    this.isLoadingViewVisible = false;
    this.isContentViewVisible = false;
    this.isEmptyViewVisible = true;

    this.dismissLoadingView();
  }

  showErrorView() {

    this.isAuthViewVisible = false;
    this.isLoadingViewVisible = false;
    this.isContentViewVisible = false;
    this.isEmptyViewVisible = false;
    this.isErrorViewVisible = true;

    this.dismissLoadingView();
  }

  showAuthView() {

    this.isLoadingViewVisible = false;
    this.isContentViewVisible = false;
    this.isEmptyViewVisible = false;
    this.isErrorViewVisible = false;
    this.isAuthViewVisible = true;

    this.dismissLoadingView();
  }

  onRefreshComplete(data = null) {

    if (this.refresher) {
      this.refresher.disabled = true;
      this.refresher.complete();
      setTimeout(() => {
        this.refresher.disabled = false;
      }, 100);
    }

    if (this.infiniteScroll) {
      this.infiniteScroll.complete();

      if (data && data.length === 0) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }
    }
  }

  async showToast(message: string, position: any = 'bottom') {

    let cssClass = '';

    if (position === 'top') {
      cssClass = 'tabs-top';
    } else if (position === 'bottom') {
      cssClass = 'tabs-bottom';
    }

    const closeText = await this.getTrans('CLOSE');
    
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: 'primary',
      position: position,
      cssClass: cssClass,
      buttons: [{
        text: closeText,
        role: 'cancel',
      }]
    });

    return await toast.present();
  }

  async showAlert(message: string) {

    const okText = await this.getTrans('OK');

    const alert = await this.alertCtrl.create({
      header: '',
      message: message,
      buttons: [okText]
    });

    return await alert.present();
  }

  showConfirm(message: string): Promise<any> {

    return new Promise(async (resolve) => {

      const str = await this.getTrans(['OK', 'CANCEL']);

      const confirm = await this.alertCtrl.create({
        header: '',
        message: message,
        buttons: [{
          text: str.CANCEL,
          role: 'cancel',
          handler: () => resolve(false),
        }, {
          text: str.OK,
          handler: () => resolve(true)
        }]
      });

      confirm.present();

    });

  }

  public getShareUrl(slug: string) {
    return this.appUrl + '/1/home/items/' + slug;
  }

  isDesktop(): boolean {
    return this.platform.is('desktop');
  }

  isIos(): boolean {
    return this.platform.is('ios');
  }

  isAndroid(): boolean {
    return this.platform.is('android');
  }

  isHybrid(): boolean {
    return this.platform.is('hybrid');
  }

  isPwa(): boolean {
    return this.platform.is('pwa');
  }

  isMobile(): boolean {
    return this.platform.is('mobile');
  }

  isCordova(): boolean {
    return this.platform.is('cordova');
  }

  setRoot(url: string) {
    return this.navCtrl.navigateRoot(url, {
      animated: true,
      animationDirection: 'forward',
    });
  }

  setRelativeRoot(page: string, queryParams: any = {}) {
    this.navCtrl.setDirection('root', true, 'forward');
    return this.router.navigate([page], {
      queryParams: queryParams,
      relativeTo: this.activatedRoute
    });
  }

  navigateTo(page: any, queryParams: any = {}) {
    return this.router.navigate([page], { queryParams: queryParams });
  }

  navigateToRelative(page: any, queryParams: any = {}) {
    return this.router.navigate([page], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  getParams() {
    return this.activatedRoute.snapshot.params;
  }

  getQueryParams() {
    return this.activatedRoute.snapshot.queryParams;
  }

  getTrans(key: string | string[]) {
    return this.translate.get(key).toPromise();
  }

  goToCartPage() {
    this.navigateTo('/1/cart');
  }

  async openUrl(url: string) {

    if (!url) return;

    if (this.platform.is('cordova')) {

      try {

        const isAvailable = await this.safariViewController.isAvailable();

        if (isAvailable) {
          await this.safariViewController.show({
            url: url,
            toolbarColor: environment.androidHeaderColor,
          }).toPromise();
        } else {
          this.inAppBrowser.create(url, '_system');
        }
      } catch (error) {
        console.log(error);
      }

    } else if (this.platform.is('pwa')) {
      this.inAppBrowser.create(url, '_blank');
    } else {
      this.inAppBrowser.create(url, '_system');
    }

  }

  async openSimpleUrl(url: string) {
    this.inAppBrowser.create(url, '_system');
  }

  async showSweetSuccessView(): Promise<any> {

    const trans = [
      'ITEM_ADDED_TO_CART',
      'CONTINUE_SHOPPING',
      'GO_TO_CHECKOUT'
    ];

    const str = await this.translate.get(trans).toPromise();

    return Swal.fire({
      title: '',
      text: str.ITEM_ADDED_TO_CART,
      confirmButtonText: str.GO_TO_CHECKOUT,
      cancelButtonText: str.CONTINUE_SHOPPING,
      showCancelButton: true,
      heightAuto: false,
      icon: 'success',
      showClass: {
        popup: 'animated fade-in'
      },
      hideClass: {
        popup: 'animated fade-out'
      },
    });

  }

}
