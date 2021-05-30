import { Component, Injector } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppConfigService } from '../../services/app-config';
import { Page } from 'src/app/services/page';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['about.scss']
})
export class AboutPage extends BasePage {

  public version: string;
  public about: any;

  public appConfig: AppConfigService;
  public pages: Page[] = [];

  constructor(injector: Injector,
    private appVersion: AppVersion,
    private pageService: Page,
    private appConfigService: AppConfigService) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

  ngOnInit() {
    this.showLoadingView({ showOverlay: false });
    this.loadAppVersion();
    this.loadData();
  }

  async ionViewDidEnter() {
    const title = await this.getTrans('SUPPORT');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  async loadAppVersion() {
    try {
      this.version = await this.appVersion.getVersionNumber();
    } catch (error) {
      console.log(error);
    }
  }
  async loadData() {
    try {

      const promise1 = this.appConfigService.load();

      const promise2 = this.pageService.load();

      const [ appConfig, pages ] = await Promise.all([ promise1, promise2 ]);

      if (appConfig.about && appConfig.about.description) {
        const description = appConfig.about.description;
        this.about = this.sanitizer.bypassSecurityTrustHtml(description);
      }

      this.appConfig = appConfig;

      this.pages = pages;

      this.showContentView();
      
    } catch (error) {
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      this.showContentView();
    }
  }

}
