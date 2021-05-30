import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: true
})
export class Filter implements PipeTransform {
  
  transform(list: any[], searchTerm: string): any[] {
     if (searchTerm) {
        searchTerm = searchTerm.toUpperCase();
        return list.filter(item => {
          let prop = item.name || item.title;
          return prop.toUpperCase().indexOf(searchTerm) !== -1 
        });
      } else {
        return list;
      }
  }

}
