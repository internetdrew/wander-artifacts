import { useEffect, useId, useRef, useState } from 'react';
import { Drawer } from '@base-ui/react/drawer';
import BellFigure from './bell/BellFigure';

const BELL_TO_BACKDROP_DELAY = 240;

export default function ConciergeBell() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const experiment = useRef<HTMLDivElement>(null);
  const bell = useRef<HTMLButtonElement>(null);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (openingTimer.current !== null) clearTimeout(openingTimer.current);
    },
    [],
  );

  function openAfterStrike() {
    if (open || openingTimer.current !== null) return;
    openingTimer.current = setTimeout(() => {
      openingTimer.current = null;
      setOpen(true);
    }, BELL_TO_BACKDROP_DELAY);
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection='down'>
      <section className='my-24' aria-labelledby={`${id}-title`}>
        <h2
          id={`${id}-title`}
          className='mb-6 text-2xl font-medium tracking-tight'
        >
          Concierge, at your service
        </h2>
        <div
          ref={experiment}
          className='relative isolate min-h-105 overflow-hidden rounded-2xl'
        >
          <BellFigure buttonRef={bell} onRing={openAfterStrike} />

          <Drawer.Portal container={experiment}>
            <Drawer.Backdrop
              className='absolute inset-0 z-10 bg-[rgb(25_32_27/34%)] opacity-0
                [&[data-open]:not([data-starting-style]):not([data-ending-style])]:opacity-100
                motion-safe:transition-opacity motion-safe:duration-240 motion-safe:ease-[ease]'
            />
            <Drawer.Viewport className='pointer-events-none absolute inset-0 z-20 overflow-hidden'>
              <Drawer.Popup
                finalFocus={bell}
                className='pointer-events-auto absolute inset-x-0 bottom-0 h-3/4 max-h-80
                  translate-y-full rounded-2xl bg-white m-2
                  shadow-[0_-16px_48px_rgb(29_37_29/14%)]
                  [&[data-open]:not([data-starting-style]):not([data-ending-style])]:translate-y-0
                  motion-safe:transition-transform motion-safe:duration-420
                  motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)]
                  motion-safe:[&[data-open]:not([data-ending-style])]:delay-100
                  data-swiping:transition-none'
              >
                <Drawer.Content className='flex h-full flex-col p-6 sm:p-8'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <Drawer.Title className='text-xl font-medium tracking-tight'>
                        How can we help?
                      </Drawer.Title>
                      <Drawer.Description className='mt-2 text-sm text-[#667067]'>
                        Your concierge is ready to help.
                      </Drawer.Description>
                    </div>
                    <Drawer.Close className='min-h-11 cursor-pointer rounded px-3 text-sm text-[#667067] focus-visible:outline-2 focus-visible:outline-[#56684b]'>
                      Close
                    </Drawer.Close>
                  </div>
                </Drawer.Content>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </div>
      </section>
    </Drawer.Root>
  );
}
