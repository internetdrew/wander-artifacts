import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import StayInvitation from './extend-your-stay/StayInvitation';
import ChooseNights from './extend-your-stay/ChooseNights';
import ReviewStayExtension from './extend-your-stay/ReviewStayExtension';

const NIGHTLY_RATE = 1150;

type View = 'invitation' | 'choose-nights' | 'review';

export default function ExtendYourStay() {
  const id = useId();
  const [view, setView] = useState<View>('invitation');
  const [{ nights, direction }, setSelection] = useState({
    nights: 1,
    direction: 1,
  });
  const changeNights = (next: number) =>
    setSelection(previous => ({
      nights: Math.min(3, Math.max(1, next)),
      direction: Math.sign(next - previous.nights) || previous.direction,
    }));
  const [today] = useState(() => new Date());
  const [completedNights, setCompletedNights] = useState(0);
  const currentCheckout = new Date(today);
  currentCheckout.setHours(11, 0, 0, 0);
  currentCheckout.setDate(currentCheckout.getDate() + 1 + completedNights);
  const currentCheckoutLabel =
    completedNights === 0
      ? 'tomorrow'
      : currentCheckout.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
  const checkout = new Date(currentCheckout);
  checkout.setHours(11, 0, 0, 0);
  checkout.setDate(checkout.getDate() + nights);
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
        return (
          <StayInvitation
            checkoutLabel={currentCheckoutLabel}
            onNext={() => setView('choose-nights')}
          />
        );
      case 'choose-nights':
        return (
          <ChooseNights
            nightlyRate={NIGHTLY_RATE}
            nights={nights}
            direction={direction}
            onChangeNights={changeNights}
            currentCheckout={currentCheckout}
            onBack={() => setView('invitation')}
            onNext={() => setView('review')}
          />
        );
      case 'review':
        return (
          <ReviewStayExtension
            checkout={checkout}
            nights={nights}
            nightlyRate={NIGHTLY_RATE}
            checkoutLabel={checkoutLabel}
            onBack={() => setView('choose-nights')}
            onNext={() => {
              setCompletedNights(previous => previous + nights);
              setSelection({ nights: 1, direction: 1 });
              setView('invitation');
            }}
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
      <div className='relative tabular-nums mx-auto sm:max-w-4/6 ring-1 ring-neutral-200/80 rounded-2xl mt-8'>
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
