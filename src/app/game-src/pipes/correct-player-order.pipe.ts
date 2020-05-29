import { Pipe, PipeTransform } from '@angular/core';

import { RoundPlayer } from '../../interfaces/round.interface';

@Pipe({
  name: 'correctPlayerOrder'
})
export class CorrectPlayerOrderPipe implements PipeTransform {

  transform(value: RoundPlayer[], currentSeat: number): unknown {
    const leftSide = value.filter(playa => playa.seatInd > currentSeat);
    const rightSide = value.filter(playa => playa.seatInd < currentSeat);
    return leftSide.concat(rightSide);
  }
}
