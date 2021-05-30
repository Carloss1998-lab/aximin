import { Pipe, LOCALE_ID, Inject } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { environment } from 'src/environments/environment';
import { Preference } from '../services/preference';

@Pipe({
  name: "currencyGlobal"
})
export class CurrencyGlobalPipe extends CurrencyPipe {
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private preference: Preference) {
    super(locale);
  }

  transform(value: number): any {
    const locale = this.preference.lang || environment.defaultLang;
    return super.transform(
      value,
      environment.currency.code,
      environment.currency.display,
      environment.currency.digitsInfo,
      locale
    );
  }
}
