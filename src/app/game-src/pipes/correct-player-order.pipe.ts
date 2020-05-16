import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'correctPlayerOrder'
})
export class CorrectPlayerOrderPipe implements PipeTransform {

  transform(value: unknown, currentSeat: number): unknown {
    console.log(currentSeat);
    return value;
  }

}
