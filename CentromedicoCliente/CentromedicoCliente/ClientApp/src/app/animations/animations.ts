import { animate, style, transition, trigger } from '@angular/animations';

export const inOutAnimation =
  trigger('inOutAnimation', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('240ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      style({ opacity: 1, position: 'absolute' }),
      animate('180ms ease-out', style({ opacity: 0, position: 'relative' }))
    ])
  ]);

export const fadeInAnimation =
  trigger('fadeInAnimation', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('220ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      style({ opacity: 1, position: 'absolute' }),
      animate('160ms ease-out', style({ opacity: 0, position: 'relative' }))
    ])
  ]);

export const fadeInUpAnimation =
  trigger('fadeInUpAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(12px)' }),
      animate('240ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]);

export const fadeInLeftAnimation =
  trigger('fadeInLeftAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-12px)' }),
      animate('240ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ]);

export const fadeInRightAnimation =
  trigger('fadeInRightAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(12px)' }),
      animate('240ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ]);

export const popInAnimation =
  trigger('popInAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.92)' }),
      animate('220ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
    ])
  ]);

export const turnoChangedAnimation = trigger('turnoChanged', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.92)' }),
    animate('240ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':increment', [
    animate('180ms ease-out', style({ color: '#0d5c9e' }))
  ]),
  transition(':decrement', [
    animate('180ms ease-out', style({ color: '#ef4444' }))
  ])
]);
