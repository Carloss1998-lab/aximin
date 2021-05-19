import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderDetailPage } from './order-detail-page';
import { SharedModule } from '../../shared.module';
import { ReviewAddPageModule } from '../review-add/review-add.module';

@NgModule({
  declarations: [
    OrderDetailPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OrderDetailPage,
      }
    ]),
    SharedModule,
    ReviewAddPageModule,
  ],
  exports: [
    OrderDetailPage
  ]
})
export class OrderDetailPageModule {}
