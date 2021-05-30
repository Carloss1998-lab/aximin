import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FavoritePage } from './favorite';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    FavoritePage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FavoritePage
      }
    ]),
    SharedModule,
  ],
})
export class FavoritePageModule {}
