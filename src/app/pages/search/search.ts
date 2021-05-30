import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Item } from '../../services/item';
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
  selector: 'page-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class SearchPage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) container: IonContent;

  public items: Item[] = [];
  public params: any = {
    limit: 100
  };
  public skeletonArray = Array(32);
  public searchTerm: string;

  public contentLoaded: Subject<any>;
  public loadAndScroll: Observable<any>;

  constructor(injector: Injector, private itemService: Item) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ngOnInit() {
    this.setupObservable();
    this.subscribeToQueryParams();
  }

  subscribeToQueryParams() {
    
    this.activatedRoute.queryParams.subscribe(queryParams => {

      const query = queryParams.q;

      if (query) {
        this.searchTerm = query;
        this.params.tag = query.toLowerCase();
        this.items = [];
        this.showLoadingView({ showOverlay: false });
        this.loadData();
      }

    });
  }

  setupObservable() {

    this.contentLoaded = new Subject();

    this.loadAndScroll = merge(
      this.container.ionScroll,
      this.contentLoaded,
    );
  }

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 600);
  }

  async ionViewDidEnter() {

    const title = await this.getTrans('SEARCH');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  async loadData(event: any = {}) {

    try {

      this.refresher = event.target;

      this.items = await this.itemService.load(this.params);

      if (this.items.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onContentLoaded();

      this.onRefreshComplete(this.items);

    } catch (error) {
      this.showContentView();
      this.onRefreshComplete();
      this.translate.get('ERROR_NETWORK').subscribe((str) => this.showToast(str));
    }

  }

  onSearch(event: any = {}) {
    if (event.key === "Enter") {
      const query = event.target.value;
      this.navigateToRelative('./', { q: query });
    }
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
