import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { Preference } from '../services/preference';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'dateGlobal'
})
export class DateGlobalPipe implements PipeTransform {
  
  constructor(private preference: Preference) {
  }

  transform(value: any, format: string = 'shortDate') {
    const locale = this.preference.lang || environment.defaultLang;
    return formatDate(value, format, locale);
  }
}
