import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UploadBoxComponent } from './upload-box/upload-box.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AccordionComponent } from './accordion/accordion.component';
import { PipesModule } from '../pipes/pipes.module';
import { BarRatingModule } from "ngx-bar-rating";

@NgModule({
	declarations: [
		UploadBoxComponent,
		ShopItemComponent,
		AccordionComponent,
	],
	imports: [
		CommonModule,
		IonicModule,
    BarRatingModule,
		TranslateModule,
    LazyLoadImageModule,
    PipesModule,
	],
	exports: [
		UploadBoxComponent,
		ShopItemComponent,
		AccordionComponent,
	]
})
export class ComponentsModule {}
