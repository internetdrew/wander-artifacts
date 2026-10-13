import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { Button } from '@base-ui/react/button';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import art from './geometry.json';
import styles from './BellFigure.module.css';
import TextSwap from '../TextSwap';

const PRESS = { duration: 0.28, times: [0, 0.2, 1], ease: 'easeOut' as const };
const RESONANCE = { duration: 0.65, ease: 'easeOut' as const };
// A quiet, synthesized metallic strike. No sample downloads or playback on load.
const PARTIALS = [
  { frequency: 1850, gain: 0.095, decay: 1.3 },
  { frequency: 2864, gain: 0.035, decay: 0.8 },
  { frequency: 4070, gain: 0.015, decay: 0.45 },
];

type Props = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  onRing: () => void;
};

export default function BellFigure({ buttonRef, onRing }: Props) {
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  const visible = useInView(container);
  const reducedMotion = useReducedMotion();
  const press = useMotionValue(0);
  const vibration = useMotionValue(0);
  const y = useTransform(press, value => value * art.pressVector[1]);
  const x = useTransform(press, value => value * art.pressVector[0]);
  const audio = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);
  const soundLabel = useMotionValue('on');

  useEffect(() => {
    if (!visible || reducedMotion) {
      press.stop();
      vibration.stop();
      press.set(0);
      vibration.set(0);
    }
  }, [visible, reducedMotion, press, vibration]);

  useEffect(
    () => () => {
      press.stop();
      vibration.stop();
      void audio.current?.close();
      audio.current = null;
    },
    [press, vibration],
  );

  async function ding() {
    try {
      const context = audio.current ?? new AudioContext();
      audio.current = context;
      await context.resume();
      if (context.state !== 'running') return;
      const start = context.currentTime;
      for (const partial of PARTIALS) {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.frequency.value = partial.frequency;
        envelope.gain.setValueAtTime(0, start);
        envelope.gain.linearRampToValueAtTime(partial.gain, start + 0.004);
        envelope.gain.exponentialRampToValueAtTime(
          0.0001,
          start + partial.decay,
        );
        oscillator.connect(envelope).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + partial.decay);
        oscillator.onended = () => {
          oscillator.disconnect();
          envelope.disconnect();
        };
      }
    } catch {
      // The interaction remains usable when browser audio is unavailable.
    }
  }

  function ring() {
    if (!muted) void ding();
    if (!reducedMotion) {
      void animate(press, [press.get(), 1, 0], PRESS);
      void animate(
        vibration,
        [vibration.get(), 0.4, -0.3, 0.18, -0.08, 0],
        RESONANCE,
      );
    }
    onRing();
  }

  return (
    <div ref={container} className='mx-auto my-7 w-3/5'>
      <button
        ref={buttonRef}
        type='button'
        aria-label='Ring the front-desk bell'
        onClick={ring}
        className='block w-full cursor-pointer mt-32 touch-manipulation rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#56684b]'
      >
        <svg
          viewBox={`0 0 ${art.width} ${art.height}`}
          className={`${styles.figure} block h-auto w-full`}
          aria-hidden='true'
        >
          <defs>
            <clipPath id={`${id}-shaft`}>
              <path d={art.shaftClip} />
            </clipPath>
          </defs>
          {art.parts.map(part => {
            const drawing = (
              <g dangerouslySetInnerHTML={{ __html: part.svg }} />
            );
            return (
              <g
                key={part.name}
                data-part={part.name}
                data-material={part.material}
                clipPath={
                  part.name === 'plunger.shaft'
                    ? `url(#${id}-shaft)`
                    : undefined
                }
              >
                {part.moving ? (
                  <motion.g style={{ x, y }}>{drawing}</motion.g>
                ) : part.name === 'bell.dome' ? (
                  <motion.g style={{ x: vibration }}>{drawing}</motion.g>
                ) : (
                  drawing
                )}
              </g>
            );
          })}
        </svg>
      </button>
      <div className='absolute top-4 right-4 text-[10px]'>
        <Button
          type='button'
          aria-pressed={muted}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          onClick={() => {
            setMuted(!muted);
            soundLabel.set(muted ? 'on' : 'off');
          }}
          className='ml-auto inline-flex py-1.5 cursor-pointer items-center gap-2 rounded-lg
            ring-[0.5px] ring-[#202020]/30 px-2 min-w-24 hover:bg-[#202020]/5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#56684b]'
        >
          <svg
            viewBox='0 0 24 24'
            className='size-4 stroke-[#202020]/80 shrink-0'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.6}
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
          >
            <path d='M11 5 6 9H3v6h3l5 4V5Z' />
            {/* Matching commands let the waves morph directly into the X. */}
            <motion.path
              initial={false}
              animate={{
                d: muted
                  ? 'M16 9 C17.67 11 19.33 13 21 15'
                  : 'M15 8 C18.5 10 18.5 14 15 16',
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <motion.path
              initial={false}
              animate={{
                d: muted
                  ? 'M21 9 C19.33 11 17.67 13 16 15'
                  : 'M18 5 C23 8.5 23 15.5 18 19',
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </svg>
          <span className='inline-flex gap-1 text-[#202020]/80'>
            <span>Sound</span>
            <TextSwap value={soundLabel} className='w-[3ch] text-left' />
          </span>
        </Button>
      </div>
    </div>
  );
}
