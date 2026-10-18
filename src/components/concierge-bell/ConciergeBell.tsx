import { useId, useRef, useState } from 'react';
import { Drawer } from '@base-ui/react/drawer';
import BellFigure from './BellFigure';

export default function ConciergeBell() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const experiment = useRef<HTMLDivElement>(null);
  const bell = useRef<HTMLButtonElement>(null);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection='down'>
      <section className='my-24 mx-4 md:mx-0' aria-labelledby={`${id}-title`}>
        <h2
          id={`${id}-title`}
          className='text-xl font-[550] leading-7 tracking-[-0.5px]'
        >
          The Concierge Bell
        </h2>
        <div
          ref={experiment}
          className='relative isolate min-h-105 overflow-hidden rounded-2xl'
        >
          <BellFigure buttonRef={bell} onSettled={() => setOpen(true)} />

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
                  translate-y-full rounded-2xl bg-white m-3
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
                      <Drawer.Description className='mt-2 text-sm'>
                        Settle in. We'll take care of the details.
                      </Drawer.Description>
                    </div>
                    <Drawer.Close className='cursor-pointer p-2 grid place-items-center rounded text-sm text-[#667067] focus-visible:outline-2 focus-visible:outline-[#56684b]'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        className='size-4'
                      >
                        <path d='M18 6 6 18' />
                        <path d='m6 6 12 12' />
                      </svg>
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
