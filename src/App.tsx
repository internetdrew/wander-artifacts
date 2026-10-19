import ExtendYourStay from './components/extend-your-stay/ExtendYourStay';
import DayAndNightPhoto from './components/day-and-night-photo/DayAndNightPhoto';
import { lazy, Suspense } from 'react';

const ConciergeBell = lazy(
  () => import('./components/concierge-bell/ConciergeBell'),
);

function App() {
  return (
    <main className='max-w-xl mx-auto space-y-16 py-8 px-4'>
      <section aria-labelledby='extended-stay-title'>
        <div>
          <h2 id='extended-stay-title' className='font-[450]'>
            Extended Stay
          </h2>
          <p className='text-neutral-500 text-[15px] font-[450] text-pretty'>
            A flow created to make that “I wish we could stay longer” moment a
            reality in just a few taps.
          </p>
        </div>
        <div className='mt-6 sm:max-w-md mx-auto'>
          <ExtendYourStay />
        </div>
      </section>
      <section aria-labelledby='day-night-title'>
        <div>
          <h2 id='day-night-title' className='font-[450]'>
            Watchmere, from day to night
          </h2>
          <p className='text-neutral-500 text-[15px] font-[450] text-pretty'>
            An artifact, styled after a postcard, so users can experience the
            view of the property from day to night.
          </p>
        </div>
        <div className='mt-6 sm:max-w-md mx-auto'>
          <DayAndNightPhoto />
        </div>
      </section>
      <section aria-labelledby='concierge-title' className='space-y-6'>
        <h2 id='concierge-title' className='font-[550]'>
          Concierge
        </h2>
        <Suspense
          fallback={
            <div className='min-h-150' aria-label='Loading concierge' />
          }
        >
          <ConciergeBell />
        </Suspense>
      </section>
    </main>
  );
}

export default App;
