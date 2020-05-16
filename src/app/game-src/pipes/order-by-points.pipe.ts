import { Pipe, PipeTransform } from '@angular/core';

import { orderBy } from 'lodash';

@Pipe({
  name: 'orderByPoints'
})
export class OrderByPointsPipe implements PipeTransform {

  transform(value: any[], order = 'desc', column: string = 'points'): any[] {
    if (!value || order === '' || !order) { return value; } // no array
    if (value.length <= 1) { return value; } // array with only one item
    if (!column || column === '') {
      if (order === 'asc') {
        return value.sort();
      } else {
        return value.sort().reverse();
      }
    } // sort 1d array
    return orderBy(value, [column], [order]);
  }

}
