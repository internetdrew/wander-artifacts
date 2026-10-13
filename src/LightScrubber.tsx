import { useEffect, useId, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import daytime from './assets/home-0.webp';
import evening from './assets/home-1.webp';
import nighttime from './assets/home-2.webp';
import styles from './LightScrubber.module.css';

const FRAMES = [
  { src: daytime, label: 'Daytime' },
  { src: evening, label: 'Early evening' },
  { src: nighttime, label: 'Nighttime' },
];
const HANDLE_INSET = 36;
const HINT_FADE_SECONDS = 0.18;
const LIGHT_SPRING = { stiffness: 120, damping: 24, mass: 0.6 };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const describe = (value: number) => FRAMES[Math.round(clamp(value) * 2)].label;

function Layer({
  src,
  index,
  t,
}: {
  src: string;
  index: number;
  t: MotionValue<number>;
}) {
  // The opaque base prevents brightness dips. Each overlay stays opaque after its stop.
  const opacity = useTransform(
    t,
    index === 0 ? [0, 1] : [(index - 1) / 2, index / 2],
    index === 0 ? [1, 1] : [0, 1],
  );

  return (
    <motion.img
      src={src}
      alt=''
      width={1449}
      height={1085}
      draggable={false}
      loading='eager'
      className='pointer-events-none absolute inset-0 block size-full object-cover'
      style={{ opacity }}
    />
  );
}

function SceneCaption({ t }: { t: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [initialLabel] = useState(() => describe(t.get()));
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let latest = describe(t.get());
    let busy = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const duration = getComputedStyle(el)
      .getPropertyValue('--text-swap-dur')
      .trim();
    const parsed = Number.parseFloat(duration);
    const durationMs = Number.isFinite(parsed)
      ? parsed * (duration.endsWith('ms') ? 1 : 1000)
      : 150;

    function swap() {
      if (!el) return;
      if (reducedMotion) {
        el.textContent = latest;
        return;
      }
      if (busy || el.textContent === latest) return;
      busy = true;
      el.classList.add(styles.exit);
      timer = setTimeout(() => {
        // Read the latest requested label, skipping stale intermediate states.
        el.textContent = latest;
        el.classList.remove(styles.exit);
        el.classList.add(styles.enterStart);
        void el.offsetWidth;
        el.classList.remove(styles.enterStart);
        timer = setTimeout(() => {
          busy = false;
          swap();
        }, durationMs);
      }, durationMs);
    }

    el.classList.remove(styles.exit, styles.enterStart);
    el.textContent = latest;
    const unsubscribe = t.on('change', value => {
      latest = describe(value);
      swap();
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
      el.classList.remove(styles.exit, styles.enterStart);
    };
  }, [t, reducedMotion]);

  return (
    <span ref={ref} className={`${styles.textSwap} font-[450] text-base`}>
      {initialLabel}
    </span>
  );
}

/** Photo scrubber: continuous updates never pass through React state. */
export default function LightScrubber() {
  const id = useId();
  const [hasInteracted, setHasInteracted] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const gesture = useRef({ start: 0, width: 1 });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, LIGHT_SPRING);
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? raw : spring;
  const handleLeft = useTransform(
    raw,
    value =>
      `calc(${HANDLE_INSET}px + (100% - ${HANDLE_INSET * 2}px) * ${clamp(value)})`,
  );

  // Keep slider semantics current without rendering during a drag.
  useMotionValueEvent(raw, 'change', value => {
    if (!slider.current) return;
    slider.current.setAttribute(
      'aria-valuenow',
      String(Math.round(value * 100)),
    );
    slider.current.setAttribute('aria-valuetext', describe(value));
  });

  return (
    <section aria-labelledby={`${id}-title`} className='mt-24'>
      {FRAMES.map(({ src }) => (
        <link key={src} rel='preload' as='image' href={src} />
      ))}
      <header className='mb-7 flex items-end justify-between gap-6 max-[601px]:block'>
        <div>
          <h2
            id={`${id}-title`}
            className='text-[24px] text-[#202020] font-[450] leading-7 tracking-[-0.24px]'
          >
            Watchmere, Day and Night
          </h2>
        </div>
      </header>

      <motion.div
        ref={surface}
        className='relative aspect-1449/1085 cursor-grab touch-pan-y overflow-hidden
          rounded-[18px] bg-[#26352c] select-none active:cursor-grabbing'
        onPanStart={() => {
          setHasInteracted(true);
          gesture.current = {
            start: raw.get(),
            width: Math.max(
              1,
              (surface.current?.getBoundingClientRect().width || 1) -
                HANDLE_INSET * 2,
            ),
          };
        }}
        onPan={(_, info) =>
          raw.set(
            clamp(
              gesture.current.start + info.offset.x / gesture.current.width,
            ),
          )
        }
      >
        <div
          className='pointer-events-none absolute inset-0 size-full'
          role='img'
          aria-label='A coastal home transitioning from daytime through early evening to nighttime'
        >
          {FRAMES.map(({ src }, index) => (
            <Layer key={src} src={src} index={index} t={t} />
          ))}
        </div>
        <div
          className={`${styles.shade} pointer-events-none absolute inset-0 size-full`}
        />
        <div
          className='pointer-events-none absolute inset-x-6.5 bottom-6.25 grid text-white
            max-[601px]:inset-x-4 max-[601px]:bottom-4.5'
          aria-hidden='true'
        >
          <SceneCaption t={t} />
        </div>
        <motion.span
          className='pointer-events-none absolute top-1/2 max-w-[calc(100%-90px)] -translate-y-1/2
            rounded-lg bg-[rgb(20_30_23/0.7)] px-3 py-2.25 text-[11px] tracking-wide
            text-white max-[601px]:text-[10px]'
          aria-hidden='true'
          initial={false}
          animate={{ opacity: hasInteracted ? 0 : 1 }}
          transition={{ duration: HINT_FADE_SECONDS }}
          style={{ left: HANDLE_INSET + 36 }}
        >
          Drag to change the time of day
        </motion.span>
        <span id={`${id}-instructions`} className='sr-only'>
          Drag left or right, or use the arrow keys to change the time of day.
        </span>
        <motion.div
          ref={slider}
          className='absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2
            cursor-grab touch-pan-y place-items-center rounded-full border border-white/80
            bg-white/94 text-[#26352c] shadow-[0_2px_12px_rgb(0_0_0/0.2)]
            focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-white
            active:cursor-grabbing active:bg-[#e5e9df] active:shadow-[0_1px_4px_rgb(0_0_0/0.22)]'
          role='slider'
          tabIndex={0}
          aria-label='Time of day'
          aria-describedby={`${id}-instructions`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-valuetext='Daytime'
          aria-orientation='horizontal'
          style={{ left: handleLeft }}
          onPointerDown={event =>
            event.currentTarget.focus({ preventScroll: true })
          }
          onKeyDown={event => {
            const steps: Record<string, number> = {
              ArrowRight: 0.05,
              ArrowUp: 0.05,
              ArrowLeft: -0.05,
              ArrowDown: -0.05,
              PageUp: 0.5,
              PageDown: -0.5,
            };
            if (event.key === 'Home' || event.key === 'End') {
              event.preventDefault();
              setHasInteracted(true);
              raw.set(event.key === 'Home' ? 0 : 1);
            } else if (event.key in steps) {
              event.preventDefault();
              setHasInteracted(true);
              raw.set(clamp(raw.get() + steps[event.key]));
            }
          }}
        >
          <svg
            width='26'
            height='20'
            viewBox='0 0 26 20'
            fill='none'
            aria-hidden='true'
          >
            <path
              d='m7 6-4 4 4 4M3 10h20M19 6l4 4-4 4'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
