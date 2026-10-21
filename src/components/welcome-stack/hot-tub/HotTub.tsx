import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import hotTub from './hot-tub.svg?raw';
import './hot-tub.css';

export default function HotTub({ active }: { active: boolean }) {
  const container = useRef<HTMLButtonElement>(null);
  const visible = useInView(container, { amount: 0.65 });
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const steaming = active && visible && !reducedMotion && !paused;

  return (
    <button
      ref={container}
      type='button'
      className='hot-tub-figure absolute inset-0 mx-auto h-full w-full max-w-64 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#202020]'
      data-steaming={steaming}
      aria-label={reducedMotion ? 'An illustrated hot tub with warm water and rising steam' : paused ? 'Resume hot tub steam animation' : 'Pause hot tub steam animation'}
      title={reducedMotion ? undefined : paused ? 'Resume steam' : 'Pause steam'}
      onClick={() => setPaused(value => !value)}
      dangerouslySetInnerHTML={{ __html: hotTub }}
    />
  );
}
