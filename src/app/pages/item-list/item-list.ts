import { Component, Injector, ViewChild, HostListener } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Item } from '../../services/item';
import { BasePage } from '../base-page/base-page';
import { SubCategory } from '../../services/sub-category';
import { Category } from '../../services/category';
import { Subject, Observable, merge } from 'rxjs';
import { FilterPage } from '../filter-modal/filter-modal.page';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { AppConfigService } from 'src/app/services/app-config';

@Component({
  selector: 'page-item-list',
  templateUrl: 'item-list.html',
  styleUrls: ['item-list.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class ItemListPage extends BasePage {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  @HostListener('window:focus')
  onFocus(): void {
    this.onContentLoaded();
  }

  public items: Item[] = [];
  public skeletonArray = Array(32);
  public params: any = {
    page: 0,
    limit: 20
  };

  public suggestions: Item[] = [];

  public loadAndScroll: Observable<any>;
  protected contentLoaded: Subject<any>;

  protected category: Category;
  protected subcategory: SubCategory;
  protected searchText: string;

  public customPopoverOptions: any = {};

  public sortOptions: Array<any>;
  public selectedSortOption: any;

  public layout: any;

  constructor(injector: Injector,
    private appConfigService: AppConfigService,
    private itemService: Item) {
    super(injector);
  }

  ngOnInit() {
    this.buildSortOptions();
    this.setupObservables();
    this.setupQueryParams();
  }

  setupObservables() {

    this.contentLoaded = new Subject();

    this.loadAndScroll = merge(
      this.content.ionScroll,
      this.contentLoaded
    );

  }

  setupQueryParams() {
    this.params.sale = this.getQueryParams().sale;
    this.params.new = this.getQueryParams().new;
    this.params.featured = this.getQueryParams().featured;
    this.params.ratingMin = this.getQueryParams().ratingMin;
    this.params.ratingMax = this.getQueryParams().ratingMax;
    this.params.priceMin = this.getQueryParams().priceMin;
    this.params.priceMax = this.getQueryParams().priceMax;

    this.params.cat = this.getQueryParams().cat;
    this.params.subcat = this.getQueryParams().subcat;
    this.params.brand = this.getQueryParams().brand;
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  async ionViewDidEnter() {

    if (!this.items.length) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }

    const title = await this.getTrans('ITEMS');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  buildSortOptions() {

    this.sortOptions = [{
      sortBy: 'desc', sortByField: 'createdAt',
    }, {
      sortBy: 'asc', sortByField: 'netPrice',
    }, {
      sortBy: 'desc', sortByField: 'netPrice',
    }, {
      sortBy: 'desc', sortByField: 'ratingTotal',
    }]

    const sortBy = this.getQueryParams().sortBy;
    const sortByField = this.getQueryParams().sortByField;

    if (sortBy && sortByField) {
      this.selectedSortOption = { sortBy, sortByField };
    } else {
      this.selectedSortOption = this.sortOptions[0];
    }
  }

  onSortOptionTouched(event: any = {}) {

    const option = Object.assign({}, event.detail.value);
    delete option.id;

    this.params = {
      ...this.params,
      ...option
    };

    this.onRefresh();

    this.navigateToRelative('.', option);
  }

  compareSortOption(o1: any, o2: any) {
    return o1 && o2 ? (o1.sortBy === o2.sortBy && o1.sortByField === o2.sortByField) : o1 === o2;
  };

  onRefresh(event: any = {}) {
    this.refresher = event.target;
    this.items = [];
    this.params.page = 0;
    this.loadData();
  }

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 400);
  }

  async loadData() {

    try {

      const appConfig = await this.appConfigService.load();
      this.layout = appConfig?.layout?.itemList;

      let items = await this.itemService.load(this.params);

      for (const item of items) {
        this.items.push(item);
      }

      if (this.items.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete(items);
      this.onContentLoaded();

    } catch (error) {

      if (this.items.length) {
        this.showContentView();
      } else {
        this.showErrorView();
      }

      this.onRefreshComplete();
      this.translate.get('ERROR_NETWORK').subscribe((str) => this.showToast(str));
    }

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

    }

  }

  async onClearSearch() {
    this.suggestions = [];
  }

  onLoadMore(event: any = {}) {
    this.infiniteScroll = event.target;
    this.params.page++;
    this.loadData();
  }

  async onPresentFilterModal() {

    await this.showLoadingView({ showOverlay: true });

    const params = Object.assign({}, this.params);

    const allowed = [
      'sale',
      'featured',
      'ratingMin',
      'ratingMax',
      'priceMin',
      'priceMax',
      'cat',
      'brand',
    ];

    const filteredParams = Object.keys(params)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = params[key]
        return obj
      }, {});

    const modal = await this.modalCtrl.create({
      component: FilterPage,
      componentProps: { params: filteredParams }
    });

    await modal.present();

    this.dismissLoadingView();

    const { data } = await modal.onDidDismiss();

    if (data) {

      const params = {
        ...this.params,
        ...data
      };

      this.params = params;

      this.showLoadingView({ showOverlay: false });
      this.onRefresh();

      this.navigateToRelative('.', data)
    }
  }

  onItemTouched(item: Item) {

    // for some reason the relative navigation isn't working
    // after updating the query params in the filter modal
    // so absolute nav is the workaround for now...

    // Get current url without params
    const url = this.router.url.split('?')[0];

    this.navigateTo(url + '/' + item.slug);
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
