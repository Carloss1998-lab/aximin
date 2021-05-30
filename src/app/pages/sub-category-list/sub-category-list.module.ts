import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubCategoryListPage } from './sub-category-list';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    SubCategoryListPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SubCategoryListPage
      }
    ]),
    SharedModule
  ],
})
export class SubCategoryListPageModule { }
