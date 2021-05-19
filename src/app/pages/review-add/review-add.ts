
import { Component, Injector, Input } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { Order } from 'src/app/services/order';

@Component({
  selector: 'page-review-add',
  templateUrl: 'review-add.html',
  styleUrls: ['review-add.scss']
})
export class ReviewAddPage extends BasePage {

  @Input() order: Order;
  @Input() item: any;

  public input: any = {
    rating: 3,
    comment: ''
  };

  constructor(injector: Injector) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

  prepareReviewData() {
    return {
      rating: this.input.rating,
      comment: this.input.comment,
      itemId: this.item.objectId
    };
  }

  async onSubmit() {

    if (!this.input.rating) {
      const message = await this.getTrans('PLEASE_SELECT_A_RATING');
      this.showToast(message);
      return;
    }

    try {

      await this.showLoadingView({ showOverlay: false });

      const review = this.prepareReviewData();

      await this.order.reviewItem(review);

      this.translate.get('REVIEW_SUCCESS').subscribe(str => this.showToast(str));

      this.showContentView();
      this.onDismiss(review);

    } catch (err) {

      this.showContentView();

      if (err.code === 5000) {
        this.translate.get('REVIEW_ALREADY_EXISTS').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }
    }
  }

  onDismiss(review: any = null) {
    this.modalCtrl.dismiss(review);
  }

}
