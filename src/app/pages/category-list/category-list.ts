import { Component, Injector, ViewChild, OnInit, HostListener } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Category } from '../../services/category';
import { BasePage } from '../base-page/base-page';
import { SubCategory } from '../../services/sub-category';
import { Subject, Observable, merge } from 'rxjs';
import { Item } from 'src/app/services/item';
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
  selector: 'page-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('40ms', [animate('100ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class CategoryListPage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) container: IonContent;

  @HostListener('window:focus')
  onFocus(): void {
    this.onContentLoaded();
  }

  public categories: Category[] = [];
  public params: any = {};
  public skeletonArray = Array(32);

  public suggestions: Item[] = [];

  protected contentLoaded: Subject<any>;
  protected loadAndScroll: Observable<any>;

  public layout: any;

  constructor(injector: Injector,
    private categoryService: Category,
    private itemService: Item,
    private appConfigService: AppConfigService,
    private subCategoryService: SubCategory) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ngOnInit() {
    this.setupObservable();
  }

  ionViewWillEnter() {
    if (this.container) {
      this.container.scrollToTop();
    }
  }

  async ionViewDidEnter() {

    if (!this.categories.length) {
      await this.showLoadingView({ showOverlay: false });
      this.loadData();
    } else {
      this.onContentLoaded();
    }

    const title = await this.getTrans('CATEGORIES');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  setupObservable() {
    this.contentLoaded = new Subject();
    this.loadAndScroll = merge(
      this.container.ionScroll,
      this.contentLoaded
    );
  }

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 400);
  }

  async loadData(event: any = {}) {

    this.refresher = event.target;

    try {

      const appConfig = await this.appConfigService.load();
      this.layout = appConfig?.layout?.categoryList;

      this.categories = await this.categoryService.load(this.params);

      if (this.categories.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();
      this.onContentLoaded();

    } catch (error) {
      this.translate.get('ERROR_NETWORK')
      .subscribe((str) => this.showToast(str));
      this.onRefreshComplete();
      this.showErrorView();
    }

  }

  private isPathFromHome(): boolean {
    return this.router.url === '/1/home/categories';
  }

  onViewAll() {
    const path = this.isPathFromHome() ? '../' : './';
    this.navigateToRelative(path + 'items');
  }

  onSuggestionTouched(suggestion: Item) {
    this.suggestions = [];
    const path = this.isPathFromHome() ? '../' : './';
    this.navigateToRelative(path + 'items/' + suggestion.slug);
  }

  async goToSubCategoryPage(category: Category) {

    const path = this.isPathFromHome() ? '../' : './';

    try {

      if (category.subCategoryCount > 0) {

        this.navigateToRelative(path + 'subcategories', {
          categoryId: category.id
        });

      } else if (category.subCategoryCount === 0) {

        this.navigateToRelative(path + 'items', {
          cat: category.id
        });

      } else {

        await this.showLoadingView({ showOverlay: false });

        const count = await this.subCategoryService.count({
          category: category
        });

        if (count) {

          this.navigateToRelative(path + 'subcategories', {
            categoryId: category.id
          });

        } else {

          this.navigateToRelative(path + 'items', {
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

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
