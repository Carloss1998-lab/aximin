
import { Component, Injector, ViewChild } from '@angular/core';
import { Review } from '../../services/review';
import { Item } from 'src/app/services/item';
import { BasePage } from '../base-page/base-page';
import { IonContent } from '@ionic/angular';
import { Subject, Observable, merge } from 'rxjs';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'page-review-list',
  templateUrl: 'review-list.html',
  styleUrls: ['review-list.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class ReviewListPage extends BasePage {

  @ViewChild(IonContent) content: IonContent;

  protected contentLoaded: Subject<any>;
  protected loadAndScroll: Observable<any>;

  public reviews: Review[] = [];
  public params: any = {};
  public skeletonReviews: Array<any>;

  constructor(injector: Injector, private reviewService: Review) {
    super(injector);
    this.params = Object.assign({}, this.getParams());
    this.params.limit = 20;
    this.params.page = 0;
    this.skeletonReviews = Array(10);
  }

  enableMenuSwipe() {
    return false;
  }

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 400);
  }

  async ionViewDidEnter() {

    this.contentLoaded = new Subject();

    this.loadAndScroll = merge(
      this.content.ionScroll,
      this.contentLoaded
    );

    await this.showLoadingView({ showOverlay: false });

    if (this.params.itemId) {
      this.params.item = await this.loadItem();

      const str = await this.getTrans('REVIEWS');

      const title = this.params.item.name + ' - ' + str;
      this.setPageTitle(title);

      this.setMetaTags({
        title: title
      });
    }

    this.loadData();
  }

  async loadItem() {
    const item = new Item;
    item.id = this.params.itemId;
    return await item.fetch();
  }

  async loadData() {

    try {

      const reviews = await this.reviewService.load(this.params);
      
      for (let review of reviews) {
        this.reviews.push(review);
      }

      if (this.reviews.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }
      
      this.onContentLoaded();
      this.onRefreshComplete(reviews);
      
    } catch (error) {

      if (this.reviews.length) {
        this.showContentView();
      } else {
        this.showErrorView();
      }

      this.onRefreshComplete();

      let message = await this.getTrans('ERROR_NETWORK');
      this.showToast(message);
    }
  }

  onLoadMore(event: any = {}) {
    this.infiniteScroll = event.target;
    this.params.page++;
    this.loadData();
  }

  onReload(event: any = {}) {
    this.refresher = event.target;
    this.reviews = [];
    this.params.page = 0;
    this.loadData();
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
