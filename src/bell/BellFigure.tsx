import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { Button } from '@base-ui/react/button';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { loadBell, type HairlineBellHandle } from './hairline/loadBell';
import TextSwap from '../TextSwap';

// Underdamped return: one clear rebound, then a smaller settling bounce.
const PLUNGER_RETURN = { type: 'spring' as const, stiffness: 420, damping: 14, mass: 0.65 };

// A quiet, synthesized metallic strike. No sample downloads or playback on load.
const PARTIALS = [
  { frequency: 1850, gain: 0.095, decay: 1.3 },
  { frequency: 2864, gain: 0.035, decay: 0.8 },
  { frequency: 4070, gain: 0.015, decay: 0.45 },
];

type Props = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  onSettled: () => void;
};

export default function BellFigure({ buttonRef, onSettled }: Props) {
  const brandPathId = useId();
  const brandPath = useRef<SVGPathElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);
  const figure = useRef<HairlineBellHandle | null>(null);
  const reducedMotion = useReducedMotion();
  const audio = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);
  const soundLabel = useMotionValue('on');

  useEffect(() => {
    const element = stage.current;
    const readout = read.current;
    if (!element || !readout) return;
    let cancelled = false;
    void loadBell()
      .then(({ definition, runtime }) => {
        if (cancelled) return;
        const svg = runtime.mk(
          'svg',
          { viewBox: '0 0 400 320', 'aria-hidden': 'true' },
          element,
        );
        figure.current = definition.mount(
          {
            stage: element,
            svg,
            read: readout,
            onSurfacePath: path => brandPath.current?.setAttribute('d', path),
            animatePlunger: (from, to, onUpdate, onComplete) => animate(from, to, {
              ...PLUNGER_RETURN,
              onUpdate, onComplete,
            }),
          },
          5,
        );
      })
      .catch(error => console.error(error));
    return () => {
      cancelled = true;
      figure.current?.destroy();
      figure.current = null;
      element.replaceChildren();
    };
  }, []);

  useEffect(
    () => () => {
      void audio.current?.close();
      audio.current = null;
    },
    [],
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
    figure.current?.ring(onSettled);
  }

  return (
    <div className='mx-auto my-7 w-full max-w-2xs touch-manipulation'>
      <button
        ref={buttonRef}
        type='button'
        aria-label='Ring the front-desk bell'
        onClick={ring}
        className='block w-full cursor-pointer mt-32 touch-manipulation rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#56684b]'
      >
        <div className='relative'>
          <div ref={stage} data-hairline='bell' className='w-full' />
          <svg
            viewBox='0 0 400 320'
            className='pointer-events-none absolute inset-0 size-full'
            aria-hidden='true'
          >
            <defs>
              <path ref={brandPath} id={brandPathId} />
            </defs>
            <text
              className='fill-[#202020]/80 text-[11px] font-[550] tracking-[0.18em]'
              textAnchor='middle'
            >
              <textPath href={`#${brandPathId}`} startOffset='50%'>
                WANDER
              </textPath>
            </text>
          </svg>
        </div>
        <span ref={read} className='sr-only' aria-hidden='true' />
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
