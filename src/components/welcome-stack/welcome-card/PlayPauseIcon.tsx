import { motion, useReducedMotion } from 'motion/react';

// Split the rounded play outline into two touching pieces. Each uses the same
// eight cubic segments as its pause bar, so Motion can interpolate the geometry.
const PLAY = [
  'M8.008 3.272 C8.008 3.272 12 5.6 12 5.6 C12 5.6 12 5.6 12 5.6 C12 5.6 12 18.4 12 18.4 C12 18.4 12 18.4 12 18.4 C12 18.4 8.008 20.728 8.008 20.728 C6.674 21.506 5 20.544 5 19 C5 19 5 5 5 5 C5 3.456 6.674 2.494 8.008 3.272 Z',
  'M12 5.6 C12 5.6 20.005 10.27 20.005 10.27 C20.625 10.632 21.006 11.291 21.006 12 C21.006 12 21.006 12 21.006 12 C21.006 12.709 20.625 13.368 20.008 13.728 C20.008 13.728 12 18.4 12 18.4 C12 18.4 12 18.4 12 18.4 C12 18.4 12 5.6 12 5.6 C12 5.6 12 5.6 12 5.6 Z',
];

function pauseBar(x: number) {
  return `M${x + 1} 3 C${x + 1} 3 ${x + 4} 3 ${x + 4} 3 C${x + 4.5523} 3 ${x + 5} 3.4477 ${x + 5} 4 C${x + 5} 4 ${x + 5} 20 ${x + 5} 20 C${x + 5} 20.5523 ${x + 4.5523} 21 ${x + 4} 21 C${x + 4} 21 ${x + 1} 21 ${x + 1} 21 C${x + 0.4477} 21 ${x} 20.5523 ${x} 20 C${x} 20 ${x} 4 ${x} 4 C${x} 3.4477 ${x + 0.4477} 3 ${x + 1} 3 Z`;
}
const PAUSE = [pauseBar(5), pauseBar(14)];

export default function PlayPauseIcon({ playing }: { playing: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='#fff'
      stroke='#fff'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      {PLAY.map((path, index) => (
        <motion.path
          key={index}
          initial={false}
          animate={{ d: playing ? PAUSE[index] : path }}
          transition={{
            duration: reducedMotion ? 0 : 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}
