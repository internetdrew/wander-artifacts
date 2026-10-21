import ExtendYourStay from './components/extend-your-stay/ExtendYourStay';
import DayAndNightPhoto from './components/day-and-night-photo/DayAndNightPhoto';
import WelcomeStack from './components/welcome-stack/WelcomeStack';

function App() {
  return (
    <main className='max-w-xl mx-auto space-y-16 py-8 px-4'>
      <header className=''>
        <h1 className='text-[17px] font-[550]'>Wander x Andrew Rowley</h1>
        <p className='text-neutral-500'>
          A collection of thoughtful interfaces and playful interactions for
          Wander, designed and built by Andrew Rowley.
        </p>
      </header>
      <section aria-labelledby='extended-stay-title'>
        <h2 id='extended-stay-title' className='font-[550] text-[15px]'>
          Extended Stay
        </h2>
        <p className='text-neutral-500 text-[15px] font-[450] text-pretty'>
          Designed to make that “I wish we could stay longer” moment a reality
          in just a few taps.
        </p>

        <div className='mt-6 sm:max-w-md mx-auto'>
          <ExtendYourStay />
        </div>
      </section>
      <section aria-labelledby='day-night-title'>
        <h2 id='day-night-title' className='font-[550]'>
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
          A shareable stack of stay essentials that helps every guest feel at
          home before they arrive and lets the person who booked enjoy their
          stay without fielding everyone's questions.
        </p>
        <div className='mt-6'>
          <WelcomeStack />
        </div>
      </section>
    </main>
  );
}

export default App;
