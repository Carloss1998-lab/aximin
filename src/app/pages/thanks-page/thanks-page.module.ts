import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThanksPage } from './thanks-page';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    ThanksPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThanksPage,
      }
    ]),
    SharedModule
  ],
})
export class ThanksPageModule {}
