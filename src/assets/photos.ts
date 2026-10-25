import day400 from './photos/home-0-400.avif';
import day480 from './photos/home-0-480.avif';
import day672 from './photos/home-0-672.avif';
import day768 from './photos/home-0-768.avif';
import day960 from './photos/home-0-960.avif';
import day1200 from './photos/home-0-1200.avif';
import day1440 from './photos/home-0-1440.avif';
import evening400 from './photos/home-1-400.avif';
import evening480 from './photos/home-1-480.avif';
import evening672 from './photos/home-1-672.avif';
import evening768 from './photos/home-1-768.avif';
import evening960 from './photos/home-1-960.avif';
import evening1200 from './photos/home-1-1200.avif';
import evening1440 from './photos/home-1-1440.avif';
import night400 from './photos/home-2-400.avif';
import night480 from './photos/home-2-480.avif';
import night672 from './photos/home-2-672.avif';
import night768 from './photos/home-2-768.avif';
import night960 from './photos/home-2-960.avif';
import night1200 from './photos/home-2-1200.avif';
import night1440 from './photos/home-2-1440.avif';

function photo(sources: readonly string[]) {
  const widths = [400, 480, 672, 768, 960, 1200, 1440];
  return {
    src: sources[3],
    srcSet: sources.map((src, index) => `${src} ${widths[index]}w`).join(', '),
    width: 1440,
    height: 902,
  };
}

export const daytime = photo([day400, day480, day672, day768, day960, day1200, day1440]);
export const evening = photo([evening400, evening480, evening672, evening768, evening960, evening1200, evening1440]);
export const nighttime = photo([night400, night480, night672, night768, night960, night1200, night1440]);

// Photo area: the 448px card on desktop; main's 576px cap on small screens,
// minus the main padding and the photo frame. Keep the HTML preload in sync.
export const dayNightSizes =
  '(min-width: 640px) 440px, (min-width: 576px) 536px, calc(100vw - 40px)';
