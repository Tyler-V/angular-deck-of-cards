import { animate, state, style, transition, trigger } from '@angular/animations';

export const Animations = {
    roundInit: trigger('RoundInitAnim', [
        state('initial', style({
            transform: 'translateX(-100px)'
          })),
        state('final', style({
            opacity: 0,
            transform: 'translateX(100%)'
        })),
        transition('* => *', animate('1000ms'))
    ])

};
