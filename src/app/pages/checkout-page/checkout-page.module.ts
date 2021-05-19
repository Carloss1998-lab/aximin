import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckoutPage } from './checkout-page';
import { SharedModule } from '../../shared.module';
import { AddressAddPageModule } from '../address-add/address-add.module';
import { CardAddPageModule } from '../card-add/card-add.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInPageModule } from '../sign-in/sign-in.module';

@NgModule({
  declarations: [
    CheckoutPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CheckoutPage
      }
    ]),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AddressAddPageModule,
    CardAddPageModule,
    SignInPageModule,
  ],
})
export class CheckoutPageModule {}
