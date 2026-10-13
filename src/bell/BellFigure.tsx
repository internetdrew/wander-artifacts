import { useEffect, useId, useRef, useState, type RefObject } from 'react';
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
  expanded: boolean;
  controls: string;
  onRing: () => void;
};

export default function BellFigure({
  buttonRef,
  expanded,
  controls,
  onRing,
}: Props) {
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
    <div ref={container} className='my-7 w-3/5 mx-auto overflow-hidden '>
      <button
        ref={buttonRef}
        type='button'
        aria-label='Ring the front-desk bell and open concierge requests'
        aria-expanded={expanded}
        aria-controls={controls}
        onClick={ring}
        className='block w-full cursor-pointer touch-manipulation rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#56684b]'
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
          <path d={art.shadow} className={styles.shadow} />
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
          <g dangerouslySetInnerHTML={{ __html: art.engraving }} />
        </svg>
      </button>
      <div className='flex items-center justify-between gap-3 px-5 pb-4 text-[11px] text-[#73776c]'>
        <button
          type='button'
          aria-pressed={muted}
          onClick={() => setMuted(value => !value)}
          className='min-h-11 cursor-pointer rounded px-2 focus-visible:outline-2 focus-visible:outline-[#56684b]'
        >
          {muted ? 'Sound off' : 'Sound on'}
        </button>
      </div>
    </div>
  );
}
