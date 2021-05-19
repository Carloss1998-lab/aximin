import { Component, Injector } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Card } from '../../services/card';
import { CardAddPage } from '../card-add/card-add';

@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
  styleUrls: ['card-list.scss']
})
export class CardListPage extends BasePage {

  public cards: Card[] = [];

  constructor(injector: Injector,
    private actionSheetCtrl: ActionSheetController,
    private creditCardService: Card) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

  async ionViewDidEnter() {

    if (!this.cards.length) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }

    const title = await this.getTrans('PAYMENT');
    this.setPageTitle(title);

    this.setMetaTags({
      title: title
    });
    
  }

  async loadData(event: any = {}) {

    try {

      this.refresher = event.target;

      this.cards = await this.creditCardService.load();

      if (this.cards.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();

    } catch (err) {
      this.showErrorView();
      this.onRefreshComplete();
      this.translate.get('ERROR_NETWORK').subscribe((str) => this.showToast(str));
    }

  }

  async presentActionSheet(card: Card) {

    const str = await this.getTrans(['ACTIONS', 'REMOVE', 'CANCEL']);

    const actionSheet = await this.actionSheetCtrl.create({
      header: str.ACTIONS,
      buttons: [{
        icon: !this.isIos() ? 'trash' : null,
        text: str.REMOVE,
        handler: () => {
          this.onDeleteCard(card);
        }
      },
      {
        icon: !this.isIos() ? 'close' : null,
        text: str.CANCEL
      }]
    });
    
    return await actionSheet.present();

  }

  async onDeleteCard(card: Card) {

    try {

      let str = await this.translate.get('DELETE_CONFIRMATION').toPromise();
      
      const res = await this.showConfirm(str);

      if (!res) return;
  
      await card.destroy();

      let index = this.cards.indexOf(card);
      if (index !== -1) this.cards.splice(index, 1);

      this.showContentView();
      this.translate.get('DELETED').subscribe(str => this.showToast(str));
      
    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

  }

  async onAddButtonTouched() {

    await this.showLoadingView({ showOverlay: true });
    
    const modal = await this.modalCtrl.create({
      component: CardAddPage,
    });

    await modal.present();

    this.dismissLoadingView();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.cards.unshift(data);
      this.showContentView();
    }
  }
}