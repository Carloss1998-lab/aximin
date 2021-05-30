import { Component, Injector, ViewChild, NgZone, HostListener, TemplateRef } from '@angular/core';
import { IonSlides, IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Item } from '../../services/item';
import { Cart } from '../../services/cart';
import { User } from '../../services/user';
import { SignInPage } from '../sign-in/sign-in';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SharePage } from '../share/share.page';
import { Subject, Observable, merge, Subscription } from 'rxjs';
import { Review } from 'src/app/services/review';
import { ItemVariation } from 'src/app/services/item-variation';
import { Lightbox } from 'ng-gallery/lightbox';
import { Gallery, GalleryConfig, GalleryRef, ImageSize, ThumbnailsPosition } from 'ng-gallery';

@Component({
  selector: 'page-item',
  templateUrl: './item.html',
  styleUrls: ['./item.scss']
})
export class ItemPage extends BasePage {

  @ViewChild('slides') slides: IonSlides;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild('itemGalleryTemplate', { static: true }) itemGalleryTemplate: TemplateRef<any>;

  @HostListener('window:focus')
  onFocus(): void {
    this.onContentLoaded();
  }

  public item: Item;
  public itemDescription: any;
  public isAddingToCart: boolean = false;
  public isLiked: boolean = false;

  public variations: ItemVariation[] = [];
  public selectedVariation: ItemVariation;

  public qty: number;

  public reviews: Review[] = [];

  public images = [];

  public relatedSlidesConfig = {
    slidesPerView: 2.8,
    spaceBetween: 8,
    slidesOffsetBefore: 8,
    slidesOffsetAfter: 8,
    grabCursor: true,
    breakpointsInverse: true,
    breakpoints: {
      992: {
        slidesPerView: 4.2,
        spaceBetween: 16,
      },
    }
  };

  public webSocialShare: { show: boolean, share: any, onClosed: any } = {
    show: false,
    share: {
      config: [{
        facebook: {
          socialShareUrl: '',
        },
      }, {
        twitter: {
          socialShareUrl: '',
        }
      }, {
        whatsapp: {
          socialShareText: '',
          socialShareUrl: '',
        }
      }, {
        copy: {
          socialShareUrl: '',
        }
      }]
    },
    onClosed: () => {
      this.webSocialShare.show = false;
    }
  };

  public contentLoaded: Subject<any>;
  public loadAndScroll: Observable<any>;

  protected slidesEvent: Subject<any>;
  protected slidesObservable: Observable<any>;

  public slidesRelatedEvent: Subject<any>;
  public slidesRelatedObservable: Observable<any>;

  public isLightboxOpen: boolean;

  public lightboxSubscriptionOpen: Subscription;
  public lightboxSubscriptionClosed: Subscription;

  public backButtonListener: any;

  public galleryRef: GalleryRef;

  public sliderGalleryOpts = {
    allowSlidePrev: false,
    allowSlideNext: false,
    zoom: {
      maxRatio: 3
    },
  };

  constructor(injector: Injector,
    private gallery: Gallery,
    private socialSharing: SocialSharing,
    private lightboxService: Lightbox,
    private itemService: Item,
    private userService: User,
    private reviewService: Review,
    private zone: NgZone,
    private cartService: Cart) {
    super(injector);
    this.qty = 1;
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ngOnInit() {
    this.setupObservables();
    this.setupGallery();
  }

  ngOnDestroy() {
    this.lightboxSubscriptionOpen.unsubscribe();
    this.lightboxSubscriptionClosed.unsubscribe();
    document.removeEventListener('ionBackButton', this.backButtonListener);
  }

  setupGallery() {
    

    const config: GalleryConfig = {
      gestures: false,
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Bottom,
      itemTemplate: this.itemGalleryTemplate,
    };

    this.galleryRef = this.gallery.ref('itemGallery');
    this.galleryRef.setConfig(config);

    this.backButtonListener = (ev: CustomEvent) => {
      ev.detail.register(10, () => {

        this.zone.run(() => {
          if (this.isLightboxOpen) {
            this.lightboxService.close();
          } else {
            this.goBack();
          }
        });

      });
    };

    document.addEventListener('ionBackButton', this.backButtonListener);

    this.lightboxSubscriptionOpen = this.lightboxService.opened.subscribe(() => {
      this.isLightboxOpen = true;
    });
    this.lightboxSubscriptionClosed = this.lightboxService.closed.subscribe(() => {
      this.isLightboxOpen = false;
    });
  }

  setupObservables() {

    this.slidesEvent = new Subject();
    this.contentLoaded = new Subject();
    this.slidesRelatedEvent = new Subject();

    this.slidesObservable = merge(
      this.content.ionScroll,
      this.slidesEvent,
      this.contentLoaded,
    );

    this.slidesRelatedObservable = merge(
      this.content.ionScroll,
      this.slidesRelatedEvent,
      this.contentLoaded,
    );

    this.loadAndScroll = merge(
      this.content.ionScroll,
      this.contentLoaded,
    );
  }

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 400);
  }

  async ionViewDidEnter() {

    try {

      if (this.item) return;

      await this.showLoadingView({ showOverlay: false });

      const itemId = await this.getParams().itemId;
      this.item = await this.itemService.loadOne(itemId);

      if (this.item.hasVariations()) {
        this.variations = this.item.variations
          .filter(variation => variation.isActive)
      }

      this.loadReviews();

      if (this.item.description) {
        this.itemDescription = this.sanitizer.bypassSecurityTrustHtml(this.item.description);
      }

      if (Array.isArray(this.item.images) && this.item.images.length) {
        this.images.push(...this.item.images);
      }

      if (this.item.featuredImage) {
        this.images = [this.item.featuredImage, ...this.images];
      }

      this.setPageTitle(this.item.name);

      this.setMetaTags({
        title: this.item.name,
        description: this.item.description,
        image: this.item.featuredImage ? this.item.featuredImage.url() : '',
        slug: this.item.slug
      });

      this.showContentView();
      this.onContentLoaded();
      this.checkIfItemIsLiked();
      this.trackView();

    } catch (error) {
      this.showErrorView();
    }

  }

  onSlidesDidLoad() {
    this.slidesEvent.next();
  }

  onSlidesWillChange() {
    this.slidesEvent.next();
  }

  onSlidesRelatedDrag() {
    this.slidesRelatedEvent.next();
  }

  async loadReviews() {
    try {
      this.reviews = await this.reviewService.load({
        item: this.item, limit: 10
      });
      this.onContentLoaded();
    } catch (err) {
      console.warn(err.message);
    }
  }

  async presentSignInModal() {

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SignInPage,
      componentProps: {
        showLoginForm: true
      }
    });

    await modal.present();

    this.showContentView();
  }

  async checkIfItemIsLiked() {

    if (User.getCurrent()) {

      try {
        this.isLiked = await this.itemService.isLiked(this.item.id);
      } catch (error) {
        console.warn(error.message);
      }

    }
  }

  async trackView() {
    try {
      await this.itemService.trackView(this.item.id);
    } catch (error) {
      console.warn(error.message);
    }
  }

  async onShare() {

    const url = this.getShareUrl(this.item.slug);

    if (this.isHybrid()) {

      try {
        await this.socialSharing.share(this.item.name, null, null, url);
      } catch (err) {
        console.warn(err)
      }

    } else if (this.isPwa() || this.isMobile()) {

      this.webSocialShare.share.config.forEach((item: any) => {
        if (item.whatsapp) {
          item.whatsapp.socialShareUrl = url;
        } else if (item.facebook) {
          item.facebook.socialShareUrl = url;
        } else if (item.twitter) {
          item.twitter.socialShareUrl = url;
        } else if (item.copy) {
          item.copy.socialShareUrl = url;
        }
      });

      this.webSocialShare.show = true;
    } else {
      this.openShareModal(url);
    }

  }

  async openShareModal(url: string) {

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SharePage,
      componentProps: { url }
    })

    await modal.present();

    this.showContentView();
  }

  async onLike() {

    if (User.getCurrent()) {

      try {
        this.isLiked = !this.isLiked;
        await this.itemService.like(this.item.id);
      } catch (error) {
        console.log(error.message);
      }

    } else {
      this.presentSignInModal();
    }

  }

  onVariationTouched(variation: ItemVariation) {
    this.selectedVariation = variation;
  }

  isQuantityInvalid() {
    return this.qty <= 1;
  }

  inc() {
    this.qty++;
  }

  dec() {
    this.qty--;
  }

  async onAddToCart() {

    try {

      if (this.item.hasVariations() && !this.selectedVariation) {
        return this.translate.get('CHOOSE_VARIATION').subscribe(str => this.showToast(str));
      }

      this.isAddingToCart = true;

      if (!User.getCurrent()) {
        const res = await this.userService.loginAnonymously();
        const user = await this.userService
          .becomeWithSessionToken(res.getSessionToken());
        window.dispatchEvent(new CustomEvent('user:login', { detail: user }));
      }

      const rawItem = Object.assign({}, this.item.toJSON());

      const allowed: any = ['objectId'];

      const filteredItem: any = Object.keys(rawItem)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = rawItem[key];
          return obj;
        }, {});

      filteredItem.qty = this.qty;

      if (this.selectedVariation) {
        filteredItem.variation = this.selectedVariation.toJSON();
      }

      let cart = await this.cartService.getOne();
      cart = cart || new Cart;

      const existInCart = cart.items.find((item: any) => {

        if (item.variation) {
          return item.objectId === filteredItem.objectId && item.variation.objectId === filteredItem.variation.objectId;
        }
        return item.objectId === filteredItem.objectId
      })

      if (existInCart) {
        this.isAddingToCart = false;
        return this.translate.get('ITEM_ALREADY_IN_CART')
          .subscribe(str => this.showToast(str));
      }

      cart.items.push(filteredItem);

      await cart.save();

      window.dispatchEvent(new CustomEvent('cart:updated', {
        detail: cart
      }));

      this.isAddingToCart = false;

      const { value } = await this.showSweetSuccessView();

      if (value) {
        this.setRoot('/1/cart/checkout');
      }

    } catch (err) {
      this.isAddingToCart = false;

      if (err.code === 3000) {
        this.translate.get('ITEM_NOT_AVAILABLE')
          .subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK')
          .subscribe(str => this.showToast(str));
      }

    }
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
