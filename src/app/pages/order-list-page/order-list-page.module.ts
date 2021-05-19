import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderListPage } from './order-list-page';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    OrderListPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OrderListPage
      }
    ]),
    SharedModule
  ],
})
export class OrderListPageModule {}
