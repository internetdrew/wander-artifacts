import ExtendYourStay from './components/extend-your-stay/ExtendYourStay';
import DayAndNightPhoto from './components/day-and-night-photo/DayAndNightPhoto';
import WelcomeStack from './components/welcome-stack/WelcomeStack';

function App() {
  return (
    <main className='max-w-xl mx-auto space-y-16 py-8 px-4'>
      <section aria-labelledby='extended-stay-title'>
        <h2 id='extended-stay-title' className='font-[450]'>
          Extended Stay
        </h2>
        <p className='text-neutral-500 text-[15px] font-[450] text-pretty'>
          A flow created to make that “I wish we could stay longer” moment a
          reality in just a few taps.
        </p>

        <div className='mt-6 sm:max-w-md mx-auto'>
          <ExtendYourStay />
        </div>
      </section>
      <section aria-labelledby='day-night-title'>
        <h2 id='day-night-title' className='font-[450]'>
          Watchmere, from day to night
        </h2>
        <p className='text-neutral-500 text-[15px] font-[450] text-pretty'>
          An artifact, styled after a postcard, so users can experience the view
          of the property from day to night.
        </p>

        <div className='mt-6 sm:max-w-md mx-auto'>
          <DayAndNightPhoto />
        </div>
      </section>
      <section aria-labelledby='welcome-stack-title'>
        <h2 id='welcome-stack-title' className='font-[450]'>
          The Welcome Stack
        </h2>
        <p className='text-neutral-500 text-[15px] font-[450] text-pretty'>
          An informative card stack accessible and sharable after booking, so
          guests can make the most of their stay as soon as they arrive.
        </p>
        <div className='mt-6 sm:max-w-md mx-auto'>
          <WelcomeStack />
        </div>
      </section>
    </main>
  );
}

export default App;
