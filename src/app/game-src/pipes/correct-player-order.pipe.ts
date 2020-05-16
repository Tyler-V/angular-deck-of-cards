import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'correctPlayerOrder'
})
export class CorrectPlayerOrderPipe implements PipeTransform {

  transform(value: unknown, currentSeat: number): unknown {
    
    return value;
  }

}
