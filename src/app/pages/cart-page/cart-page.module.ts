import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartPage } from './cart-page';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CartPage
      }
    ]),
    SharedModule
  ],
})
export class CartPageModule {}
