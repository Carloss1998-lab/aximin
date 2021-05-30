import { Component, Injector } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { Card } from '../../services/card';
import { CardAddPage } from '../card-add/card-add';

@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
  styleUrls: ['card-list.scss']
})
export class CardListModalPage extends BasePage {

  public cards: Card[] = [];

  constructor(injector: Injector,
    private creditCardService: Card) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewDidEnter() {

    if (!this.cards.length) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }
    
  }

  onCardTouched(card: Card) {
    this.onDismiss(card);
  }

  onDismiss(card: Card = null) {
    this.modalCtrl.dismiss(card);
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

  async onAddButtonTouched() {

    await this.showLoadingView({ showOverlay: true });
    
    const modal = await this.modalCtrl.create({
      component: CardAddPage,
    });

    await modal.present();

    this.showContentView();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.cards.unshift(data);
      this.showContentView();
    }
  }
}