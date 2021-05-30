import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { User } from '../../services/user';
import { ProfileEditPage } from '../profile-edit/profile-edit';
import { ChangePasswordPage } from '../change-password/change-password';
import { SettingsPage } from '../settings-page/settings-page';
import { SignInPage } from '../sign-in/sign-in';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss']
})
export class ProfilePage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) container: IonContent;

  public user: User;

  public isGuest: boolean;

  constructor(injector: Injector) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewWillEnter() {
    if (this.container) {
      this.container.scrollToTop();
    }
  }

  async ionViewDidEnter() {

    this.user = User.getCurrent();
    this.checkIsGuest();

    const title = await this.getTrans('PROFILE');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
  }

  ngOnInit() {
    this.user = User.getCurrent();
    this.checkIsGuest();

    window.addEventListener('user:login', (ev: CustomEvent) => {
      this.user = ev.detail;
      this.checkIsGuest();
    });

    window.addEventListener('user:loggedOut', () => {
      this.user = null;
    });
  }

  checkIsGuest() {
    this.isGuest = this.user &&
      this.user.authData &&
      this.user.authData['anonymous'] !== undefined;
  }

  goTo(page: string) {

    if (!User.getCurrent() && page !== 'help') {
      return this.onPresentSignInModal();
    }

    this.navigateToRelative('./' + page);
  }

  async onPresentSignInModal() {

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

  async onPresentSignUpModal() {

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SignInPage,
      componentProps: {
        showSignUpForm: true
      }
    });

    await modal.present();

    this.showContentView();
  }

  async onPresentEditModal() {

    if (!User.getCurrent()) return this.onPresentSignInModal();

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: ProfileEditPage
    });

    await modal.present();

    this.showContentView();
  }

  async onPresentChangePasswordModal() {

    if (!User.getCurrent()) return this.onPresentSignInModal();

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: ChangePasswordPage
    });

    await modal.present();

    this.showContentView();
  }

  async onPresentSettingsModal() {

    if (!User.getCurrent()) return this.onPresentSignInModal();

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SettingsPage
    });

    await modal.present();

    this.showContentView();
  }

  onLogout() {
    window.dispatchEvent(new CustomEvent('user:logout'));
  }

}
