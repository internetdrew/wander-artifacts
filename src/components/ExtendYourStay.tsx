import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import StayInvitation from './extend-your-stay/StayInvitation';
import ChooseNights from './extend-your-stay/ChooseNights';
import ReviewStayExtension from './extend-your-stay/ReviewStayExtension';
import CheckoutPass from './extend-your-stay/CheckoutPass';

const NIGHTLY_RATE = 1150;

type View = 'invitation' | 'choose-nights' | 'review' | 'confirmed';

export default function ExtendYourStay() {
  const id = useId();
  const [view, setView] = useState<View>('invitation');
  const [{ nights, direction }, setCount] = useState({
    nights: 1,
    direction: 1,
  });
  const changeNights = (delta: number) =>
    setCount(previous => ({
      nights: Math.min(3, Math.max(1, previous.nights + delta)),
      direction: delta,
    }));
  const [today] = useState(() => new Date());
  const checkout = new Date(today);
  checkout.setHours(11, 0, 0, 0);
  checkout.setDate(checkout.getDate() + 1 + nights);
  const checkoutLabel = checkout.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const content = useRef<HTMLDivElement>(null);
  const previousView = useRef(view);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (previousView.current === view) return;
    content.current?.focus({ preventScroll: true });
    previousView.current = view;
  }, [view]);

  function renderView() {
    switch (view) {
      case 'invitation':
        return <StayInvitation onNext={() => setView('choose-nights')} />;
      case 'choose-nights':
        return (
          <ChooseNights
            nightlyRate={NIGHTLY_RATE}
            nights={nights}
            direction={direction}
            onChangeNights={changeNights}
            checkoutLabel={checkoutLabel}
            onBack={() => setView('invitation')}
            onNext={() => setView('review')}
          />
        );
      case 'review':
        return (
          <ReviewStayExtension
            nights={nights}
            nightlyRate={NIGHTLY_RATE}
            checkoutLabel={checkoutLabel}
            onBack={() => setView('choose-nights')}
            onNext={() => setView('confirmed')}
          />
        );
      case 'confirmed':
        return (
          <CheckoutPass
            checkout={checkout}
            nights={nights}
            nightlyRate={NIGHTLY_RATE}
          />
        );
    }
  }

  return (
    <section
      className='mx-4 mt-20 min-h-96 md:mx-0'
      aria-labelledby={`${id}-title`}
    >
      <h2
        id={`${id}-title`}
        className='text-[24px] font-[450] leading-7 tracking-[-0.5px]'
      >
        Stay a Little Longer
      </h2>
      <div className='relative tabular-nums mx-auto sm:max-w-4/6 ring-1 ring-neutral-200/80 rounded-2xl mt-8 overflow-hidden'>
        <div
          ref={content}
          tabIndex={-1}
          className='relative flow-root p-4 pt-3 outline-none'
        >
          <AnimatePresence initial={false} mode='popLayout'>
            <motion.div
              key={view}
              initial={{ opacity: reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                pointerEvents: 'none',
                transition: { duration: reducedMotion ? 0 : 0.1 },
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.15,
                ease: [0.23, 1, 0.32, 1],
              }}
              className='flow-root'
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
