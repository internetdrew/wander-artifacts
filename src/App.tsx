import ExtendYourStay from './components/ExtendYourStay';
import DayAndNightPhoto from './DayAndNightPhoto';
import { lazy, Suspense } from 'react';

const ConciergeBell = lazy(() => import('./ConciergeBell'));

function App() {
  return (
    <main className='max-w-2xl mx-auto'>
      <ExtendYourStay />
      <DayAndNightPhoto />
      <Suspense
        fallback={<div className='min-h-150' aria-label='Loading concierge' />}
      >
        <ConciergeBell />
      </Suspense>
    </main>
  );
}

export default App;
