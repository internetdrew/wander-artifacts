import DeferredStayExtension from './components/extend-your-stay/DeferredStayExtension';
import DayAndNightPhoto from './components/day-and-night-photo/DayAndNightPhoto';
import DeferredWelcomeStack from './components/welcome-stack/DeferredWelcomeStack';
import { ProjectNoteDialog } from './components/ProjectNoteDialog';
import {
  ExtendedStayNotes,
  DayAndNightNotes,
  WelcomeStackNotes,
} from './components/ProjectNotes';

function App() {
  return (
    <main className='max-w-xl mx-auto space-y-16 py-8 px-4'>
      <header className=''>
        <h1 className='text-[17px] font-[550]'>Wander x Andrew Rowley</h1>
        <p className='text-neutral-500 font-[450]'>
          A collection of thoughtful interfaces and playful interactions for
          Wander, designed and built by Andrew Rowley.
        </p>
      </header>
      <section aria-labelledby='extended-stay-title'>
        <div className='relative flex items-center'>
          <h2 id='extended-stay-title' className='font-[550] text-[15px]'>
            Extended Stay
          </h2>
          <ProjectNoteDialog title='Extended Stay'>
            <ExtendedStayNotes />
          </ProjectNoteDialog>
        </div>

        <div className='mt-6 sm:max-w-md mx-auto'>
          <DeferredStayExtension />
        </div>
      </section>
      <section aria-labelledby='day-night-title'>
        <div className='relative flex items-center'>
          <h2 id='day-night-title' className='font-[550]'>
            Watchmere's Dynamic Postcard
          </h2>
          <ProjectNoteDialog title={`Watchmere's Dynamic Postcard`}>
            <DayAndNightNotes />
          </ProjectNoteDialog>
        </div>

        <div className='mt-6 sm:max-w-md mx-auto'>
          <DayAndNightPhoto />
        </div>
      </section>
      <section aria-labelledby='welcome-stack-title'>
        <div className='relative flex items-center'>
          <h2 id='welcome-stack-title' className='font-[550]'>
            The Welcome Stack
          </h2>
          <ProjectNoteDialog title='The Welcome Stack'>
            <WelcomeStackNotes />
          </ProjectNoteDialog>
        </div>
        <div className='mt-6'>
          <DeferredWelcomeStack />
        </div>
      </section>
    </main>
  );
}

export default App;
