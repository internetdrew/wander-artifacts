import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { Switch } from '@base-ui/react/switch';
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
  const opacity = useTransform(progress, value =>
    index === 0 ? 1 : Math.min(1, Math.max(0, value * 2 - (index - 1))),
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
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      className='size-4 fill-[#202020]/90'
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
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinejoin='round'
      className='size-4 fill-[#202020]/90'
      aria-hidden='true'
    >
      <path d='M20.5 14.2A8.8 8.8 0 0 1 9.8 3.5a8.8 8.8 0 1 0 10.7 10.7Z' />
    </svg>
  );
}

export default function DayAndNightPhoto() {
  const id = useId();
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
  const travel = useRef<{ stop: () => void } | null>(null);
  useEffect(() => () => travel.current?.stop(), []);

  // The photo passes through evening during the day/night transition.
  useMotionValueEvent(progress, 'change', value => {
    const nextScene = value < 0.25 ? 0 : value < 0.75 ? 1 : 2;
    setScene(previous => (previous === nextScene ? previous : nextScene));
  });
  const selectEndpoint = (value: number) => {
    travel.current?.stop();
    if (reducedMotion) {
      progress.set(value);
      return;
    }
    travel.current = animate(progress, value, {
      duration: 0.4,
      ease: [0.645, 0.045, 0.355, 1],
    });
  };

  return (
    <section
      className='mx-4 mt-20 md:mx-0'
      aria-labelledby={`${id}-experience-title`}
    >
      <h2
        id={`${id}-experience-title`}
        className='text-xl font-[550] leading-7 tracking-[-0.5px]'
      >
        Day and Night
      </h2>
      <div
        ref={cardBounds}
        className='@container mx-auto mt-8 w-full max-w-5/6 sm:max-w-4/6 perspective-[900px]'
        onPointerMove={event => {
          if (reducedMotion) return;
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
          className="flex aspect-108/86 w-full flex-col px-[4.166667cqw] pt-[4.166667cqw] rounded-[5px] bg-[#f7f4ec] bg-[linear-gradient(rgb(247_244_236/0.68),rgb(247_244_236/0.68)),url('./assets/polaroid%20texture.avif')] bg-size-[auto,370px_370px] shadow-[inset_0_0_0_1px_#e7e1d6,0_1px_3px_rgb(48_37_20/0.05),0_8px_18px_rgb(48_37_20/0.06)]"
          style={{
            rotateX: reducedMotion ? 0 : rotateX,
            rotateY: reducedMotion ? 0 : rotateY,
            z: reducedMotion ? 0 : z,
          }}
        >
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
          <div className='flex flex-1 items-center justify-between gap-3'>
            <p className='handwritten text-lg text-[#202020] sm:text-xl'>
              Watchmere awaits...
            </p>
            <div
              className='flex shrink-0 items-center gap-2 text-[#202020]'
              data-day-night-control
            >
              <SunIcon />
              <label className='flex h-11 cursor-pointer items-center'>
                <span className='sr-only'>Night view</span>
                <Switch.Root
                  onCheckedChange={checked => selectEndpoint(checked ? 1 : 0)}
                  className='flex w-11 rounded-full bg-[#202020]/10 p-1 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#81765d]'
                >
                  <Switch.Thumb className='size-4 rounded-full bg-[#202020]/90 shadow-sm transition-[translate] duration-200 ease-out data-checked:translate-x-5 motion-reduce:transition-none' />
                </Switch.Root>
              </label>
              <MoonIcon />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
