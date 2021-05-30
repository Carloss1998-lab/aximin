import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { Brand } from 'src/app/services/brand';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { Observable, Subject, merge } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/app-config';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.page.html',
  styleUrls: ['./brand-list.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('40ms', [animate('100ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class BrandListPage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) container: IonContent;

  public brands: Brand[] = [];

  public loadAndScroll: Observable<any>;
  protected contentLoaded: Subject<any>;

  public layout: any;

  constructor(injector: Injector,
    private appConfigService: AppConfigService,
    private brandService: Brand) {
    super(injector);
  }

  ngOnInit() {
    this.setupObservable();
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  async ionViewDidEnter() {

    const title = await this.getTrans('CATEGORIES');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });

    if (!this.brands.length) {
      await this.showLoadingView({ showOverlay: false });
      this.loadData();
    } else {
      this.onContentLoaded();
    }
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
      this.layout = appConfig?.layout?.brandList;

      this.brands  = await this.brandService.load();
      this.onRefreshComplete();

      if (this.brands.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }
      
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

