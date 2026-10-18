import ExtendYourStay from './components/extend-your-stay/ExtendYourStay';
import DayAndNightPhoto from './components/day-and-night-photo/DayAndNightPhoto';
import { lazy, Suspense, useState } from 'react';
import { Tabs } from '@base-ui/react/tabs';

const ConciergeBell = lazy(
  () => import('./components/concierge-bell/ConciergeBell'),
);

const demos = [
  { value: 'stay', label: 'Extended Stay' },
  { value: 'photo', label: 'Day & Night' },
  { value: 'concierge', label: 'Concierge' },
];

function App() {
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  return (
    <main className='max-w-sm mx-auto'>
      <Tabs.Root
        defaultValue='stay'
        data-keyboard-navigation={keyboardNavigation || undefined}
        onKeyDownCapture={() => setKeyboardNavigation(true)}
        onPointerDownCapture={() => setKeyboardNavigation(false)}
      >
        <Tabs.List
          aria-label='Component demos'
          className='relative isolate mx-4 mt-8 flex w-fit gap-1 rounded-xl bg-neutral-100 p-1 md:mx-0'
        >
          {demos.map(({ value, label }) => (
            <Tabs.Tab
              key={value}
              value={value}
              className='shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 data-active:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700'
            >
              {label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className='demo-tab-indicator pointer-events-none absolute top-0 left-0 -z-1 rounded-lg bg-white shadow-sm' />
        </Tabs.List>
        <div className='relative'>
          <Tabs.Panel value='stay' className='demo-panel'>
            <ExtendYourStay />
          </Tabs.Panel>
          <Tabs.Panel value='photo' className='demo-panel'>
            <DayAndNightPhoto />
          </Tabs.Panel>
          <Tabs.Panel value='concierge' className='demo-panel'>
            <Suspense
              fallback={
                <div className='min-h-150' aria-label='Loading concierge' />
              }
            >
              <ConciergeBell />
            </Suspense>
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </main>
  );
}

export default App;
