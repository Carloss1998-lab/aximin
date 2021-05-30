import { NgModule } from '@angular/core';
import { CardAddPage } from './card-add';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from "ngx-stripe";

@NgModule({
  declarations: [
    CardAddPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule,
  ],
  entryComponents: [
    CardAddPage
  ]
})
export class CardAddPageModule {}
