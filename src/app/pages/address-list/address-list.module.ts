import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddressListPage } from './address-list';
import { SharedModule } from '../../shared.module';
import { AddressAddPageModule } from '../address-add/address-add.module';

@NgModule({
  declarations: [
    AddressListPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AddressListPage
      }
    ]),
    SharedModule,
    AddressAddPageModule
  ],
})
export class AddressListPageModule {}
