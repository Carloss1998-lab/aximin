import { NgModule } from '@angular/core';
import { ReviewAddPage } from './review-add';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [
    ReviewAddPage,
  ],
  imports: [
    SharedModule,
    FormsModule,
  ],
  entryComponents: [
    ReviewAddPage
  ]
})
export class ReviewAddPageModule {}
