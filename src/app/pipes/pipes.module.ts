import { NgModule } from '@angular/core';
import { Filter } from './filter';
import { ExcerptFilter } from './excerpt-filter';
import { CurrencyGlobalPipe } from './currency-global';
import { DateGlobalPipe } from './date-global';
@NgModule({
	declarations: [
	  Filter,
    ExcerptFilter,
    CurrencyGlobalPipe,
    DateGlobalPipe,
	],
	imports: [],
	exports: [
	  Filter,
    ExcerptFilter,
    CurrencyGlobalPipe,
    DateGlobalPipe,
	]
})
export class PipesModule {}
