import { animate, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';

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
    ]),
    cardAnimation: trigger('cardAnimation', [
        transition('* => *', [
          query(':enter', style({ opacity: 0 }), { optional: true }),
          query(':enter', stagger('100ms', [
            animate('.75s cubic-bezier(0.215, 0.61, 0.355, 1)',
              keyframes([
                style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0 }),
                style({ opacity: 0.2, transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
                style({ opacity: 0.4, transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4 }),
                style({ opacity: 0.6, transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6 }),
                style({ opacity: 0.8, transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8 }),
                style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 1.0 }),
              ]))]), { optional: true })
        ])
      ])

};
