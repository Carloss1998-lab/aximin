import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutPage } from './about';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutPage
      }
    ])
  ],
})
export class AboutPageModule {}
