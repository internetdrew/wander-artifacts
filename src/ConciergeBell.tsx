import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import BellFigure from './bell/BellFigure';

/* ANIMATION STORYBOARD
 *   0ms   BellFigure handles the press and audible strike
 *  80ms   request card enters; options follow at 45ms intervals
 */
const TIMING = { card: 0.08, fade: 0.18, stagger: 0.045 };
const CARD = {
  offset: 8,
  spring: { type: 'spring' as const, stiffness: 320, damping: 30 },
};
const REQUESTS = [
  {
    title: 'Plan something special',
    description: 'Dinner reservations, local favorites, and little surprises.',
  },
  {
    title: 'Make my stay more comfortable',
    description: 'Housekeeping, extra essentials, or help with the home.',
  },
  {
    title: 'Ask a question',
    description: 'Arrival details, recommendations, or anything else.',
  },
];

export default function ConciergeBell() {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const bell = useRef<HTMLButtonElement>(null);
  const firstOption = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) firstOption.current?.focus({ preventScroll: true });
  }, [open]);

  function close() {
    setOpen(false);
    bell.current?.focus({ preventScroll: true });
  }

  return (
    <section className='mt-24' aria-labelledby={`${id}-title`}>
      <div>
        <h2 id={`${id}-title`} className='text-2xl font-medium tracking-tight'>
          Consierge, at your service
        </h2>

        <BellFigure
          buttonRef={bell}
          expanded={open}
          controls={`${id}-requests`}
          onRing={() => setOpen(true)}
        />
      </div>

      <div
        id={`${id}-requests`}
        onKeyDown={event => {
          if (event.key === 'Escape' && open) {
            event.preventDefault();
            close();
          }
        }}
      >
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key='requests'
              initial={{ opacity: 0, y: reducedMotion ? 0 : CARD.offset }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : CARD.offset }}
              transition={
                reducedMotion
                  ? { duration: TIMING.fade }
                  : { ...CARD.spring, delay: TIMING.card }
              }
              className='mx-auto max-w-lg rounded-2xl border border-[#26352c]/10 bg-[#f7f7f2] p-5 sm:p-6'
            >
              <div className='mb-4 flex items-center justify-between gap-4'>
                <h3 className='font-medium'>How can we help?</h3>
                <button
                  type='button'
                  onClick={close}
                  className='min-h-11 cursor-pointer rounded px-2 text-xs text-[#667067] focus-visible:outline-2 focus-visible:outline-[#56684b]'
                >
                  Close
                </button>
              </div>
              <div className='space-y-2'>
                {REQUESTS.map((request, index) => (
                  <motion.button
                    key={request.title}
                    ref={index === 0 ? firstOption : undefined}
                    type='button'
                    aria-pressed={selected === request.title}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : CARD.offset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: TIMING.fade,
                      delay: reducedMotion
                        ? 0
                        : TIMING.card + index * TIMING.stagger,
                    }}
                    onClick={() => setSelected(request.title)}
                    className='block w-full cursor-pointer rounded-xl border border-[#26352c]/10 bg-white px-4 py-3 text-left hover:border-[#56684b]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#56684b] aria-pressed:border-[#56684b] aria-pressed:bg-[#edf0e7]'
                  >
                    <span className='block text-sm font-medium'>
                      {request.title}
                    </span>
                    <span className='mt-1 block text-xs leading-relaxed text-[#667067]'>
                      {request.description}
                    </span>
                  </motion.button>
                ))}
              </div>
              <p
                role='status'
                className='mt-4 text-xs leading-relaxed text-[#667067]'
              >
                {selected
                  ? `“${selected}” selected. This is a preview; no request has been sent.`
                  : 'Demo concierge · Choose an option to preview a request.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
