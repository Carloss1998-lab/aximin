import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardListPage } from './card-list';
import { SharedModule } from '../../shared.module';
import { CardAddPageModule } from '../card-add/card-add.module';

@NgModule({
  declarations: [
    CardListPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CardListPage
      }
    ]),
    SharedModule,
    CardAddPageModule,
  ],
})
export class CardListPageModule {}
