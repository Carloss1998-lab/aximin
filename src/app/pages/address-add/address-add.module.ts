import { NgModule } from '@angular/core';
import { AddressAddPage } from './address-add';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddressAddPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AddressAddPage
  ]
})
export class AddressAddPageModule {}
