import { Component, Injector, ViewChild, HostListener, NgZone } from '@angular/core';
import { IonSlides, IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Slide } from '../../services/slide';
import { Item } from '../../services/item';
import * as Parse from 'parse';
import { Category } from '../../services/category';
import { SubCategory } from '../../services/sub-category';
import { Subject, Observable, merge, of } from 'rxjs';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { Brand } from 'src/app/services/brand';
import { AppConfigService } from 'src/app/services/app-config';

@Component({
  selector: 'page-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('70ms', [animate('100ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class HomePage extends BasePage {

  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild('mainSlider') ionSlides: IonSlides;

  @HostListener('window:focus')
  onFocus(): void {
    this.onContentLoaded();
  }

  public slidesConfig = {
    centeredSlides: true,
    slidesPerView: 1.2,
    spaceBetween: 10,
    grabCursor: true,
    initialSlide: 1,
    breakpointsInverse: true,
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 1.5,
        spaceBetween: 30,
      },
    }
  };

  public slidesBrandsConfig = {
    slidesOffsetBefore: 16,
    slidesOffsetAfter: 16,
    slidesPerView: 3.4,
    spaceBetween: 8,
    grabCursor: true,
  };

  public slidesItemsConfig = {
    slidesOffsetBefore: 16,
    slidesOffsetAfter: 16,
    slidesPerView: 2.4,
    spaceBetween: 16,
    grabCursor: true,
  };

  public skeletonArray = Array(6);

  public slides: Slide[] = [];
  public categories: Category[] = [];
  public itemsOnSale: Item[] = [];
  public itemsNewArrival: Item[] = [];
  public itemsFeatured: Item[] = [];
  public items: Item[] = [];
  public itemsRandom: Item[] = [];
  public brands: Brand[] = [];

  public suggestions: Item[] = [];

  private queryItems: any = {
    page: 0,
    limit: 20,
    sortBy: 'desc',
    sortByField: 'createdAt',
  };

  protected contentLoaded: Subject<any>;
  protected loadAndScroll: Observable<any>;

  public slidesBrandsEvent: Subject<any>;
  public slidesBrandsObservable: Observable<any>;

  public slidesItemsOnSaleEvent: Subject<any>;
  public slidesItemsOnSaleObservable: Observable<any>;

  public slidesItemsNewArrivalEvent: Subject<any>;
  public slidesItemsNewArrivalObservable: Observable<any>;

  public slidesItemsFeaturedEvent: Subject<any>;
  public slidesItemsFeaturedObservable: Observable<any>;

  public isSlidesLoaded: boolean;
  public isSlidesBrandsLoaded: boolean;

  public isSlidesItemsOnSaleLoaded: boolean;
  public isSlidesItemsNewArrivalLoaded: boolean;
  public isSlidesItemsFeaturedLoaded: boolean;

  public defaultLayout = {
    blocks: [{
      type: 'slider_images',
    }, {
      type: 'categories',
    }, {
      type: 'brands',
    }, {
      type: 'featured_items',
    }, {
      type: 'sale_items',
    }, {
      type: 'new_arrival_items',
    }, {
      type: 'random_items',
    }]
  };

  public layout: any;

  constructor(injector: Injector,
    private subCategoryService: SubCategory,
    private appConfigService: AppConfigService,
    private zone: NgZone,
    private itemService: Item) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ngOnInit() {
    this.setupObservable();

    this.showLoadingView({ showOverlay: false });
    this.loadData();
  }

  ionViewWillEnter() {
    if (this.content) {
      this.content.scrollToTop();
    }
    if (this.ionSlides) {
      this.ionSlides.startAutoplay();
    }
  }

  ionViewWillLeave() {
    if (this.ionSlides) {
      this.ionSlides.stopAutoplay();
    }
  }

  async ionViewDidEnter() {

    const title = await this.getTrans('APP_NAME');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  onSlidesDidLoad() {
    this.isSlidesLoaded = true;
    this.ionSlides.startAutoplay();
  }

  onSlidesDidChange() {
    this.contentLoaded.next();
  }

  onSlidesBrandsChange() {
    this.slidesBrandsEvent.next();
  }

  onSlidesBrandsLoaded() {
    this.isSlidesBrandsLoaded = true;
  }

  onSlidesItemsOnSaleLoaded() {
    this.isSlidesItemsOnSaleLoaded = true;
  }

  onSlidesItemsNewArrivalLoaded() {
    this.isSlidesItemsNewArrivalLoaded = true;
  }

  onSlidesItemsFeaturedLoaded() {
    this.isSlidesItemsFeaturedLoaded = true;
  }

  onSlidesItemsOnSaleChange() {
    this.slidesItemsOnSaleEvent.next();
  }

  onSlidesItemsNewArrivalChange() {
    this.slidesItemsNewArrivalEvent.next();
  }

  onSlidesItemsFeaturedChange() {
    this.slidesItemsFeaturedEvent.next();
  }

  setupObservable() {

    this.contentLoaded = new Subject();

    this.loadAndScroll = merge(
      this.content.ionScroll,
      this.contentLoaded,
    );

    this.slidesBrandsEvent = new Subject();

    this.slidesBrandsObservable = merge(
      this.content.ionScroll,
      this.slidesBrandsEvent,
      this.contentLoaded,
    );

    this.slidesItemsOnSaleEvent = new Subject();

    this.slidesItemsOnSaleObservable = merge(
      this.content.ionScroll,
      this.slidesItemsOnSaleEvent,
      this.contentLoaded,
    );

    this.slidesItemsNewArrivalEvent = new Subject();

    this.slidesItemsNewArrivalObservable = merge(
      this.content.ionScroll,
      this.slidesItemsNewArrivalEvent,
      this.contentLoaded,
    );

    this.slidesItemsFeaturedEvent = new Subject();

    this.slidesItemsFeaturedObservable = merge(
      this.content.ionScroll,
      this.slidesItemsFeaturedEvent,
      this.contentLoaded,
    );
  }

  onContentLoaded() {
    this.contentLoaded.next();
  }

  onSlideTouched(slide: Slide) {
    if (slide.item) {
      this.navigateToRelative('./items/' + slide.item.slug);
    } else if (slide.brand) {
      this.navigateToRelative('./items', {
        brand: slide.brand.id
      });
    } else if (slide.category) {
      this.navigateToRelative('./items', {
        cat: slide.category.id
      });
    } else if (slide.subcategory) {
      this.navigateToRelative('./items', {
        subcat: slide.subcategory.id
      });
    } else if (slide.url) {
      this.openUrl(slide.url);
    } else {
      // no action required
    }
  }

  async onCategoryTouched(category: Category) {

    try {

      if (category.subCategoryCount > 0) {

        this.navigateToRelative('./subcategories', {
          categoryId: category.id
        });

      } else if (category.subCategoryCount === 0) {

        this.navigateToRelative('./items', {
          cat: category.id
        });

      } else {

        await this.showLoadingView({ showOverlay: false });

        const count = await this.subCategoryService.count({
          category: category
        });

        if (count) {

          this.navigateToRelative('./subcategories', {
            categoryId: category.id
          });

        } else {

          this.navigateToRelative('./items', {
            cat: category.id
          });

        }

        this.showContentView();

      }

    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK')
        .subscribe((str) => this.showToast(str));
    }

  }

  async loadData(event: any = {}) {

    try {

      this.refresher = event.target;

      this.queryItems.page = 0;

      const appConfig = await this.appConfigService.load();

      const homeLayout = appConfig?.layout?.home

      if (homeLayout && homeLayout.enabled) {
        this.layout = homeLayout;
      } else {
        this.layout = this.defaultLayout;
      }

      const data = await Parse.Cloud.run('getHomePageData');

      this.slides = data.slides;
      this.categories = data.categories;
      this.itemsOnSale = data.itemsOnSale;
      this.itemsNewArrival = data.itemsNewArrival;
      this.itemsFeatured = data.itemsFeatured;
      this.brands = data.brands;
      this.items = data.items;

      if (this.content) {
        this.content.scrollToTop();
      }

      this.onRefreshComplete();
      this.showContentView();

      this.onContentLoaded();

    } catch (error) {
      this.onRefreshComplete();
      this.showErrorView();
    }

  }

  onLoadMoreRandom(event: any = {}) {
    this.infiniteScroll = event.target;
    this.loadRandomItems();
  }

  onLoadMore(event: any = {}) {
    this.infiniteScroll = event.target;
    this.loadItems();
  }

  async loadItems() {

    try {
      const items = await this.itemService.load({
        page: this.queryItems.page++,
        ...this.queryItems
      });

      for (const item of items) {
        this.items.push(item);
      }

      this.onRefreshComplete(this.items);
      this.onContentLoaded();

    } catch (error) {
      this.translate.get('ERROR_NETWORK')
        .subscribe((str) => this.showToast(str));
    }

  }

  loadRandomItems() {

    this.itemService.loadInCloud(this.queryItems).then((items: Item[]) => {

      for (const item of items) {
        this.itemsRandom.push(item);
      }

      this.onRefreshComplete(this.itemsRandom);

    }).catch(error => {
      console.warn(error);
    });

  }

  async onClearSearch() {
    this.suggestions = [];
  }

  onBlurSearchInput() {
    setTimeout(() => this.suggestions = [], 100);
  }

  async onSearch(event: any = {}) {

    const searchTerm = event.target.value;

    if (searchTerm) {

      try {
        this.suggestions = await this.itemService.load({
          tag: searchTerm.toLowerCase(),
          limit: 10,
        });
      } catch (error) {
        console.log(error.message);
      }

    } else {
      this.suggestions = [];
    }

  }

  onSuggestionTouched() {
    //setTimeout(() => this.suggestions = [], 300);
  }

  onSubmitSearch(event: any = {}) {

    if (event.key === "Enter") {

      const searchTerm = event.target.value;

      if (searchTerm) {
        this.suggestions = [];
        this.navigateToRelative('./search', { q: searchTerm });
      }
    }
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}