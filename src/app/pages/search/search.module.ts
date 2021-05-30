import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchPage } from './search';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SearchPage
      }
    ]),
    SharedModule,
  ],
})
export class SearchPageModule {}
