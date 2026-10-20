import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';

// Placeholder speech levels until the welcome audio supplies real samples.
const WELCOME_LEVELS = [
  0.12, 0.25, 0.5, 0.8, 0.62, 0.35, 0.18, 0.1,
  0.3, 0.66, 0.95, 0.72, 0.44, 0.2, 0.1, 0.16,
  0.42, 0.7, 0.88, 0.56, 0.32, 0.15, 0.08, 0.24,
  0.5, 0.36, 0.2, 0.1,
];

interface VoiceWaveformProps {
  levels?: readonly number[];
  playing?: boolean;
  analyser?: AnalyserNode | null;
  progress?: number;
  onSeek?: (progress: number) => void;
  currentTime?: number;
  duration?: number;
}

export default function VoiceWaveform({
  levels = WELCOME_LEVELS,
  progress = 0,
  playing = false,
  analyser = null,
  onSeek,
  currentTime = 0,
  duration = 0,
}: VoiceWaveformProps) {
  const root = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const live = playing && !!analyser && !reducedMotion;

  useEffect(() => {
    if (!live || !analyser) return;
    const bars = root.current?.querySelectorAll<HTMLElement>('.welcome-waveform-bar');
    if (!bars?.length) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const envelopes = new Float32Array(bars.length);
    const starts = new Uint16Array(bars.length);
    const ends = new Uint16Array(bars.length);
    const binHz = analyser.context.sampleRate / analyser.fftSize;
    for (let index = 0; index < bars.length; index++) {
      starts[index] = Math.max(1, Math.floor(80 * (4000 / 80) ** (index / bars.length) / binHz));
      ends[index] = Math.min(data.length, Math.max(starts[index] + 1,
        Math.ceil(80 * (4000 / 80) ** ((index + 1) / bars.length) / binHz)));
    }
    let frame = 0;
    let previous = performance.now();
    function draw(now: number) {
      if (!analyser || !bars) return;
      const elapsed = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      analyser.getByteFrequencyData(data);
      for (let index = 0; index < bars.length; index++) {
        let peak = 0;
        for (let bin = starts[index]; bin < ends[index]; bin++) peak = Math.max(peak, data[bin]);
        const target = peak / 255;
        // Fast attack follows syllables; slower release softens their falloff.
        const response = 1 - Math.exp(-elapsed / (target > envelopes[index] ? 0.035 : 0.14));
        envelopes[index] += (target - envelopes[index]) * response;
        bars[index].style.transform = `scaleY(${0.125 + envelopes[index] * 0.875})`;
      }
      frame = requestAnimationFrame(draw);
    }
    function visibility() {
      cancelAnimationFrame(frame);
      if (!document.hidden) { previous = performance.now(); frame = requestAnimationFrame(draw); }
    }
    if (!document.hidden) frame = requestAnimationFrame(draw);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', visibility);
      for (const bar of bars) bar.style.removeProperty('transform');
    };
  }, [live, analyser, levels.length]);

  return (
    <span
      ref={root}
      data-live={live || undefined}
      className='welcome-waveform relative rounded-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#202020]'
      style={{
        '--n': levels.length,
        '--prog': Math.min(1, Math.max(0, progress)),
      } as CSSProperties}
    >
      {levels.map((level, index) => (
        <i
          key={index}
          aria-hidden='true'
          className='welcome-waveform-bar'
          style={{ '--l': Math.min(1, Math.max(0, level)), '--i': index } as CSSProperties}
        />
      ))}
      {onSeek && (
        <input
          type='range'
          min={0}
          max={1}
          step={0.001}
          value={Math.min(1, Math.max(0, progress))}
          onChange={event => onSeek(event.currentTarget.valueAsNumber)}
          aria-label='Seek welcome audio'
          aria-valuetext={`${Math.floor(currentTime)} of ${Math.floor(duration)} seconds`}
          className='absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 cursor-ew-resize opacity-0'
        />
      )}
    </span>
  );
}
