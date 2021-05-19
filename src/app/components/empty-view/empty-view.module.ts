import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { EmptyView } from './empty-view';

@NgModule({
  declarations: [
    EmptyView,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    EmptyView
  ]
})
export class EmptyViewModule {}
