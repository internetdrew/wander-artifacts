import { useId, useRef, useState, type PointerEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import daytime from '../../assets/home-0.webp';
import evening from '../../assets/home-1.webp';
import nighttime from '../../assets/home-2.webp';

const TILT = { max: 12, depth: -6, spring: { stiffness: 200, damping: 24 } };

const SCENES = [
  {
    src: daytime,
    label: 'This morning',
    caption: 'A slow, sunlit start',
    description:
      'Soft daylight fills the windows and spills across the decks. Take your coffee outside and ease into the day at Watchmere.',
  },
  {
    src: evening,
    label: 'This evening',
    caption: 'Let the evening linger',
    description:
      'As daylight fades, the windows glow and the house takes on a warmer mood. Settle on the deck and let the evening linger.',
  },
  {
    src: nighttime,
    label: 'Tonight',
    caption: 'Come in, get cozy',
    description:
      'Lit windows and the welcoming porch light stand out against the night. Head inside, get comfortable, and make yourself at home.',
  },
];

function PhotoLayer({
  src,
  index,
  progress,
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [0, 0.5, 1],
    index === 0 ? [1, 1, 1] : index === 1 ? [0, 1, 1] : [0, 0, 1],
  );
  return (
    <motion.img
      src={src}
      alt=''
      width={1449}
      height={1085}
      draggable={false}
      className='pointer-events-none absolute inset-0 size-full select-none object-cover'
      style={{ opacity }}
    />
  );
}

function SunIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='#202020'
      stroke='#202020'
      strokeWidth='1.5'
      strokeLinecap='round'
      className='size-4 shrink-0'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42' />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='#202020'
      stroke='#202020'
      strokeWidth='1.5'
      strokeLinejoin='round'
      className='size-4 shrink-0'
      aria-hidden='true'
    >
      <path d='M20.5 14.2A8.8 8.8 0 0 1 9.8 3.5a8.8 8.8 0 1 0 10.7 10.7Z' />
    </svg>
  );
}

export default function DayAndNightPhoto() {
  const controlsId = useId();
  const [controlsOpen, setControlsOpen] = useState(false);
  const [scrubberStart, setScrubberStart] = useState(0);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const cardBounds = useRef<HTMLDivElement>(null);
  const touchPointer = useRef<number | null>(null);
  const rotateX = useSpring(0, TILT.spring);
  const rotateY = useSpring(0, TILT.spring);
  const z = useSpring(0, TILT.spring);
  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    z.set(0);
  };
  const progress = useMotionValue(0);
  const [scene, setScene] = useState(0);
  const reducedMotion = useReducedMotion();
  const updateTilt = (event: PointerEvent<HTMLDivElement>) => {
    const rect = cardBounds.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    const y = Math.min(
      1,
      Math.max(0, (event.clientY - rect.top) / rect.height),
    );
    const touch = event.pointerType !== 'mouse';
    const strength = touch ? TILT.max * 0.65 : TILT.max;
    if (touch) {
      rotateX.jump(strength * (0.5 - y));
      rotateY.jump(strength * (x - 0.5));
      z.jump(TILT.depth);
    } else {
      rotateX.set(strength * (0.5 - y));
      rotateY.set(strength * (x - 0.5));
      z.set(TILT.depth);
    }
  };
  const endTouchTilt = (event: PointerEvent<HTMLDivElement>) => {
    if (touchPointer.current !== event.pointerId) return;
    touchPointer.current = null;
    resetTilt();
  };
  // The photo passes through evening during the day/night transition.
  useMotionValueEvent(progress, 'change', value => {
    const nextScene = value < 0.25 ? 0 : value < 0.75 ? 1 : 2;
    setScene(previous => (previous === nextScene ? previous : nextScene));
  });

  return (
    <section aria-label='Day and night'>
      <div
        ref={cardBounds}
        className='@container relative z-20 mx-auto w-full perspective-[900px]'
        onPointerMove={event => {
          if (reducedMotion || controlsOpen) return;
          if (event.pointerType !== 'mouse') {
            if (touchPointer.current === event.pointerId) updateTilt(event);
            return;
          }
          if (event.buttons) return;
          if (
            (event.target as HTMLElement).closest(
              'input, button, [data-day-night-control]',
            )
          ) {
            resetTilt();
            return;
          }
          updateTilt(event);
        }}
        onPointerLeave={event => {
          if (event.pointerType === 'mouse') resetTilt();
        }}
        onPointerDown={event => {
          resetTilt();
          if (
            reducedMotion ||
            controlsOpen ||
            event.pointerType === 'mouse' ||
            !event.isPrimary ||
            !(event.target as HTMLElement).closest('[data-tilt-surface]')
          )
            return;
          touchPointer.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateTilt(event);
        }}
        onPointerUp={endTouchTilt}
        onPointerCancel={endTouchTilt}
        onLostPointerCapture={endTouchTilt}
      >
        <motion.div
          style={{
            rotateX: reducedMotion || controlsOpen ? 0 : rotateX,
            rotateY: reducedMotion || controlsOpen ? 0 : rotateY,
            z: reducedMotion || controlsOpen ? 0 : z,
          }}
        >
          <div className="relative z-20 w-full p-1 rounded-[5px] bg-[#f7f4ec] bg-[linear-gradient(rgb(247_244_236/0.68),rgb(247_244_236/0.68)),url('./assets/polaroid%20texture.avif')] bg-size-[auto,370px_370px] shadow-[inset_0_0_0_1px_#e7e1d6,0_1px_3px_rgb(48_37_20/0.05),0_8px_18px_rgb(48_37_20/0.06)]">
            <div
              data-tilt-surface
              className='relative w-full shrink-0 touch-pan-y aspect-99/62 overflow-hidden rounded-[1px] bg-[#26352c]'
              role='img'
              aria-label={`Watchmere, a coastal home, ${SCENES[scene].label.toLowerCase()}`}
            >
              {SCENES.map(({ src }, index) => (
                <PhotoLayer
                  key={src}
                  src={src}
                  index={index}
                  progress={progress}
                />
              ))}
            </div>
            <button
              ref={settingsButton}
              type='button'
              aria-label={controlsOpen ? 'Close time-of-day controls' : 'Adjust time of day'}
              aria-expanded={controlsOpen}
              aria-controls={controlsId}
              onClick={() => {
                resetTilt();
                setScrubberStart(progress.get() * 100);
                setControlsOpen(open => !open);
              }}
              className='absolute right-3 bottom-3 grid size-10 cursor-pointer place-items-center rounded-full bg-neutral-800/30 text-white hover:bg-neutral-800/40 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white'
            >
              <span className='t-icon-swap' data-state={controlsOpen ? 'b' : 'a'} aria-hidden='true'>
                <span className='t-icon' data-icon='a'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='size-4'
              >
                <path d='m9.5 3-.7 2.3-2 .9-2.2-.6-2.5 4.3 1.6 1.7v2.3l-1.6 1.7 2.5 4.3 2.2-.6 2 .9.7 2.3h5l.7-2.3 2-.9 2.2.6 2.5-4.3-1.6-1.7v-2.3l1.6-1.7-2.5-4.3-2.2.6-2-.9-.7-2.3z' />
                <circle cx='12' cy='12.75' r='3' />
              </svg>
                </span>
                <span className='t-icon' data-icon='b'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='size-4'>
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </span>
              </span>
            </button>
          </div>
          <AnimatePresence initial={false}>
            {controlsOpen && (
              <motion.div
                key='time-controls'
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{
                  type: 'spring',
                  duration: reducedMotion ? 0 : 0.35,
                  bounce: 0,
                }}
                className='relative z-10 mx-auto w-[92%] overflow-hidden'
              >
                <motion.div
                  initial={{ y: reducedMotion ? 0 : '-100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: reducedMotion ? 0 : '-100%' }}
                  transition={{
                    type: 'spring',
                    duration: reducedMotion ? 0 : 0.35,
                    bounce: 0,
                  }}
                  id={controlsId}
                  role='group'
                  aria-label='Time of day'
                  className="rounded-b-[20px] bg-[#f7f4ec] bg-[linear-gradient(rgb(247_244_236/0.68),rgb(247_244_236/0.68)),url('./assets/polaroid%20texture.avif')] bg-size-[auto,370px_370px] px-5 text-[#202020]/70"
                  onKeyDown={event => {
                    if (event.key === 'Escape') {
                      setControlsOpen(false);
                      settingsButton.current?.focus();
                    }
                  }}
                >
                  <div className='flex items-center gap-3'>
                    <SunIcon />
                    <input
                      type='range'
                      min={0}
                      max={100}
                      step={0.1}
                      defaultValue={scrubberStart}
                      aria-label='Time of day'
                      aria-valuetext={SCENES[scene].label}
                      onChange={event =>
                        progress.set(event.currentTarget.valueAsNumber / 100)
                      }
                      className='day-night-scrubber h-10 min-w-0 flex-1 cursor-ew-resize appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81765d]'
                    />
                    <MoonIcon />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
