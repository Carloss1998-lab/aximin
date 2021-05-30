import { NgModule } from '@angular/core';
import { CardListModalPage } from './card-list';
import { SharedModule } from '../../shared.module';
import { CardAddPageModule } from '../card-add/card-add.module';

@NgModule({
  declarations: [
    CardListModalPage,
  ],
  imports: [
    SharedModule,
    CardAddPageModule,
  ],
  entryComponents: [
    CardListModalPage
  ]
})
export class CardListModalPageModule {}
