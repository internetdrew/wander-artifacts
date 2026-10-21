import { Button } from '@base-ui/react';
import { useRef, useState } from 'react';
import VoiceWaveform from './VoiceWaveform';
import PlayPauseIcon from './PlayPauseIcon';
import welcomeAudio from '../../../assets/watchmere.mp3';
import waveform from '../../../assets/watchmere-waveform.json';

function timestamp(seconds: number) {
  const wholeSeconds = Number.isFinite(seconds)
    ? Math.max(0, Math.floor(seconds))
    : 0;
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}

export default function WelcomeAudioPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  async function togglePlayback() {
    const media = audio.current;
    if (!media) return;
    if (!media.paused) {
      media.pause();
      return;
    }
    setError('');
    if (media.ended) media.currentTime = 0;
    // Call play directly in the click handler for mobile gesture requirements.
    const playRequest = media.play();
    try {
      await playRequest;
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === 'AbortError')
        return;
      setError('Could not play the welcome audio. Please try again.');
    }
  }

  function seek(progress: number) {
    const media = audio.current;
    if (!media || !Number.isFinite(media.duration) || media.duration <= 0)
      return;
    media.currentTime = Math.min(1, Math.max(0, progress)) * media.duration;
    setCurrentTime(media.currentTime);
  }

  return (
    <>
      <audio
        ref={audio}
        src={welcomeAudio}
        preload='metadata'
        onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
        onDurationChange={event => {
          const next = event.currentTarget.duration;
          setDuration(Number.isFinite(next) ? next : 0);
        }}
        onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={event => {
          setPlaying(false);
          setCurrentTime(event.currentTarget.duration);
        }}
        onError={() => {
          setPlaying(false);
          setError('Could not load the welcome audio. Please try again.');
        }}
      />
      <div className='bg-[#ECEFF0] rounded-full w-full flex items-center justify-between gap-2 py-2 pl-2 pr-3'>
        <Button
          type='button'
          aria-label={playing ? 'Pause welcome audio' : 'Play welcome audio'}
          aria-pressed={playing}
          onClick={togglePlayback}
          className='bg-[#202020] rounded-full cursor-pointer grid place-items-center p-1.5 shrink-0 hover:bg-[#202020]/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#202020] transition-colors'
        >
          <PlayPauseIcon playing={playing} />
        </Button>
        <VoiceWaveform
          levels={waveform.levels}
          progress={duration > 0 ? currentTime / duration : 0}
          onSeek={duration > 0 ? seek : undefined}
          onTogglePlayback={togglePlayback}
          currentTime={currentTime}
          duration={duration}
        />
        <span className='shrink-0 text-xs tabular-nums font-[450] text-neutral-500'>
          {timestamp(currentTime)}
        </span>
      </div>
      {error && (
        <p role='alert' className='mt-2 text-xs text-red-700'>
          {error}
        </p>
      )}
    </>
  );
}
