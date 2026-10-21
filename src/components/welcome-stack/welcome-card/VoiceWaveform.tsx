import { useId, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Placeholder speech levels until the welcome audio supplies real samples.
const WELCOME_LEVELS = [
  0.12, 0.25, 0.5, 0.8, 0.62, 0.35, 0.18, 0.1, 0.3, 0.66, 0.95, 0.72, 0.44, 0.2,
  0.1, 0.16, 0.42, 0.7, 0.88, 0.56, 0.32, 0.15, 0.08, 0.24, 0.5, 0.36, 0.2, 0.1,
];

interface VoiceWaveformProps {
  levels?: readonly number[];
  progress?: number;
  onSeek?: (progress: number) => void;
  onTogglePlayback?: () => void;
  currentTime?: number;
  duration?: number;
}

export default function VoiceWaveform({
  levels = WELCOME_LEVELS,
  progress = 0,
  onSeek,
  onTogglePlayback,
  currentTime = 0,
  duration = 0,
}: VoiceWaveformProps) {
  const keyboardHintId = useId();
  const reducedMotion = useReducedMotion();
  const playedBars = Math.min(1, Math.max(0, progress)) * levels.length;

  return (
    <span
      className='welcome-waveform relative rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#202020]'
    >
      {levels.map((level, index) => (
        <motion.i
          key={index}
          aria-hidden='true'
          className='welcome-waveform-bar'
          initial={false}
          animate={{
            opacity: 0.3 + 0.7 * Math.min(1, Math.max(0, playedBars - index)),
          }}
          transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'linear' }}
          style={
            {
              '--l': Math.min(1, Math.max(0, level)),
            } as CSSProperties
          }
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
          onKeyDown={event => {
            if (event.key !== ' ' || !onTogglePlayback) return;
            event.preventDefault();
            event.stopPropagation();
            if (!event.repeat) onTogglePlayback();
          }}
          onKeyUp={event => {
            if (event.key === ' ' && onTogglePlayback) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          aria-label='Seek welcome audio'
          aria-describedby={onTogglePlayback ? keyboardHintId : undefined}
          aria-keyshortcuts={onTogglePlayback ? 'Space' : undefined}
          aria-valuetext={`${Math.floor(currentTime)} of ${Math.floor(duration)} seconds`}
          className='absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 cursor-ew-resize opacity-0'
        />
      )}
      {onSeek && onTogglePlayback && (
        <span id={keyboardHintId} className='sr-only'>
          Use arrow keys to seek. Press Space to play or pause.
        </span>
      )}
    </span>
  );
}
