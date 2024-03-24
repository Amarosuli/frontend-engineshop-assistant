import {
  AnimationTriggerMetadata,
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function FadeIn(
  timingIn: number,
  timingOut: number,
  height: boolean = false
): AnimationTriggerMetadata {
  return trigger('fadeIn', [
    transition(':enter', [
      style(height ? { opacity: 0, height: 0 } : { opacity: 0 }),
      group([
        animate(
          `${timingIn}ms ease-out`,
          style(height ? { opacity: 1, height: 'fit-content' } : { opacity: 1 })
        ),
        query('@slideIn', animateChild()),
      ]),
    ]),
    transition(':leave', [
      group([
        animate(
          `${timingOut}ms ease-out`,
          style(height ? { opacity: 0, height: 0 } : { opacity: 0 })
        ),
        query('@slideIn', animateChild()),
      ]),
    ]),
  ]);
}

export function SlideIn(
  timingIn: number,
  timingOut: number
): AnimationTriggerMetadata {
  return trigger('slideIn', [
    transition(':enter', [
      style({ transform: 'translateX(50px)' }),
      animate(`${timingIn}ms ease-out`, style({ transform: 'none' })),
    ]),
    transition(':leave', [
      animate(
        `${timingOut}ms ease-out`,
        style({ transform: 'translateX(50px)' })
      ),
    ]),
  ]);
}
