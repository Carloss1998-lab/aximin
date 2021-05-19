import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemListPage } from './item-list';
import { SharedModule } from '../../shared.module';
import { FilterPageModule } from '../filter-modal/filter-modal.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ItemListPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ItemListPage
      }
    ]),
    SharedModule,
    FilterPageModule,
    FormsModule,
  ],
})
export class ItemListPageModule {}
