import { useLayoutEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import machine from './machine.svg?raw';

/** Fixed-camera geometry extracted from the Colorfigures coffee-machine model.
 * Only the coffee surface and pour change; the machine never redraws per frame.
 */
export default function CoffeeMachine({ active }: { active: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const visible = useInView(container, { amount: 0.65 });
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const host = container.current;
    const svg = host?.querySelector('svg');
    const liquid = svg?.querySelector<SVGGElement>('[data-coffee-liquid]');
    const stream = svg?.querySelector<SVGGElement>('[data-coffee-stream]');
    if (!host || !svg || !liquid || !stream) return;
    const x = Number(svg.dataset.liquidX);
    const y = Number(svg.dataset.liquidY);
    const drop = Number(svg.dataset.liquidDrop);
    let phase: 'empty' | 'pouring' | 'full' | undefined;
    const paint = (progress: number) => {
      const radius = 0.84 + progress * 0.16;
      liquid.setAttribute(
        'transform',
        `translate(${x} ${y + drop * (1 - progress)}) scale(${radius}) translate(${-x} ${-y})`,
      );
      const nextPhase = progress === 0 ? 'empty' : progress === 1 ? 'full' : 'pouring';
      if (nextPhase !== phase) {
        liquid.style.opacity = nextPhase === 'empty' ? '0' : '1';
        stream.style.opacity = nextPhase === 'pouring' ? '1' : '0';
        host.dataset.coffeeState = nextPhase;
        phase = nextPhase;
      }
    };
    if (!active || !visible) {
      paint(0);
      return;
    }
    if (reducedMotion) {
      paint(1);
      return;
    }
    paint(0);
    const playback = animate(0, 1, {
      delay: 0.3,
      duration: 1.9,
      ease: [0.45, 0, 0.55, 1],
      onUpdate: paint,
      onComplete: () => paint(1),
    });
    return () => playback.stop();
  }, [active, visible, reducedMotion]);

  return (
    <div
      ref={container}
      role='img'
      aria-label='An illustrated espresso machine pouring coffee into a cup'
      className='pointer-events-none absolute inset-0 mx-auto h-full w-full max-w-64 [&>svg]:h-full [&>svg]:w-full'
      dangerouslySetInnerHTML={{ __html: machine }}
    />
  );
}
