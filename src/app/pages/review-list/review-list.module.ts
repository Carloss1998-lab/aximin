import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReviewListPage } from './review-list';
import { SharedModule } from '../../shared.module';
 
@NgModule({
  declarations: [
    ReviewListPage,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReviewListPage
      }
    ])
  ]
})
export class ReviewListPageModule {}
