import { Component, Injector, ViewChild, HostListener } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { SubCategory } from '../../services/sub-category';
import { Category } from 'src/app/services/category';
import { Subject, Observable, merge } from 'rxjs';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { IonContent } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/app-config';

@Component({
  selector: 'page-sub-category-list',
  templateUrl: 'sub-category-list.html',
  styleUrls: ['sub-category-list.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class SubCategoryListPage extends BasePage {

  @ViewChild(IonContent, { static: true }) container: IonContent;

  @HostListener('window:focus')
  onFocus(): void {
    this.onContentLoaded();
  }

  public subcategories: SubCategory[] = [];
  public params: any = {};
  public skeletonArray = Array(32);

  protected contentLoaded: Subject<any>;
  protected loadAndScroll: Observable<any>;

  public layout: any;

  constructor(injector: Injector,
    private appConfigService: AppConfigService,
    public subCategoryService: SubCategory) {
    super(injector);
  }

  ngOnInit() {
    const category = new Category;
    category.id = this.getQueryParams().categoryId;
    this.params.category = category;

    this.setupObservable();
  }

  enableMenuSwipe(): boolean {
    return false;
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

  async ionViewDidEnter() {

    if (!this.subcategories.length) {
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

  async loadData(event: any = {}) {

    this.refresher = event.target;

    try {

      const appConfig = await this.appConfigService.load();
      this.layout = appConfig?.layout?.subcategoryList;

      this.subcategories = await this.subCategoryService.load(this.params);

      if (this.subcategories.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();
      this.onContentLoaded();
      
    } catch (error) {
      this.translate.get('ERROR_NETWORK').subscribe((str) => this.showToast(str));
      this.onRefreshComplete();
      this.showErrorView();
    }

  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
