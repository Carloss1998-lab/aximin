import { Component, Injector, OnInit } from '@angular/core';
import { Page } from '../../services/page';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-page',
  templateUrl: './page.page.html',
  styleUrls: ['./page.page.scss'],
})
export class PageView extends BasePage implements OnInit {

  public page: Page;
  public content: any;

  constructor(injector: Injector,
    private pageService: Page) {
    super(injector);
  }

  enableMenuSwipe() {
    return true;
  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.showLoadingView({ showOverlay: false });
    this.loadPage();
  }

  async loadPage() {
    try {

      this.page = await this.pageService.loadOne(this.getParams().id);

      if (this.page.content) {
        this.content = this.sanitizer
        .bypassSecurityTrustHtml(this.page.content);
      }

      this.setPageTitle(this.page.title);

      this.setMetaTags({
        title: this.page.title
      });

      this.showContentView();
      
    } catch (error) {

      if (error.code === 101) {
        this.showEmptyView();
      } else {
        this.showErrorView();
      }

      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }
  }

  onContentTouched(ev: any = {}) {
    const href = ev.target.getAttribute('href');
    if (href) {
      ev.preventDefault();
      this.openUrl(href);
    }
  }

}
