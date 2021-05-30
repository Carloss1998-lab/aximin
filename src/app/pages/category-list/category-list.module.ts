import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryListPage } from './category-list';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    CategoryListPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CategoryListPage,
      }
    ]),
    SharedModule
  ],
})
export class CategoryListPageModule {}
