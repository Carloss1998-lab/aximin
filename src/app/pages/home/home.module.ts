import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePage } from './home';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    SharedModule
  ],
})
export class HomePageModule { }
