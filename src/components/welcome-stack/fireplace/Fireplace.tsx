import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import fireplace from './fireplace.svg?raw';
import './fireplace.css';

export default function Fireplace({ active }: { active: boolean }) {
  const container = useRef<HTMLButtonElement>(null);
  const visible = useInView(container, { amount: 0.65 });
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const dancing = active && visible && !reducedMotion && !paused;

  return (
    <button
      ref={container}
      type='button'
      className='fireplace-figure absolute inset-0 mx-auto h-full w-full max-w-64 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#202020]'
      data-dancing={dancing}
      aria-label={reducedMotion ? 'An illustrated stone fireplace with a warm fire' : paused ? 'Resume fireplace animation' : 'Pause fireplace animation'}
      title={reducedMotion ? undefined : paused ? 'Resume flame' : 'Pause flame'}
      onClick={() => setPaused(value => !value)}
      dangerouslySetInnerHTML={{ __html: fireplace }}
    />
  );
}
