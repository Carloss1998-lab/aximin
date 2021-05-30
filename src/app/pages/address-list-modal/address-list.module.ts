import { NgModule } from '@angular/core';
import { AddressListModalPage } from './address-list';
import { SharedModule } from '../../shared.module';
import { AddressAddPageModule } from '../address-add/address-add.module';

@NgModule({
  declarations: [
    AddressListModalPage,
  ],
  imports: [
    SharedModule,
    AddressAddPageModule
  ],
  entryComponents: [
    AddressListModalPage
  ]
})
export class AddressListModalPageModule {}
