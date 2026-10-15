import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import StayInvitation from './extend-your-stay/StayInvitation';
import ChooseNights from './extend-your-stay/ChooseNights';
import ReviewStayExtension from './extend-your-stay/ReviewStayExtension';

const NIGHTLY_RATE = 1150;

type Screen = 'invitation' | 'choose-nights' | 'review' | 'confirmed';

export default function ExtendYourStay() {
  const id = useId();
  const [screen, setScreen] = useState<Screen>('invitation');
  const [{ nights, direction }, setCount] = useState({ nights: 1, direction: 1 });
  const changeNights = (delta: number) => setCount(previous => ({
    nights: Math.min(3, Math.max(1, previous.nights + delta)),
    direction: delta,
  }));
  const [today] = useState(() => new Date());
  const checkout = new Date(today);
  checkout.setHours(11, 0, 0, 0);
  checkout.setDate(checkout.getDate() + 1 + nights);
  const checkoutLabel = checkout.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });
  const content = useRef<HTMLDivElement>(null);
  const previousScreen = useRef(screen);
  const [height, setHeight] = useState<number>();
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const element = content.current;
    if (!element) return;
    const measure = () => setHeight(element.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (previousScreen.current === screen) return;
    content.current?.focus({ preventScroll: true });
    previousScreen.current = screen;
  }, [screen]);

  function renderScreen() {
    switch (screen) {
      case 'invitation':
        return <StayInvitation onNext={() => setScreen('choose-nights')} />;
      case 'choose-nights':
        return (
          <ChooseNights
            nightlyRate={NIGHTLY_RATE}
            nights={nights}
            direction={direction}
            onChangeNights={changeNights}
            checkoutLabel={checkoutLabel}
            onBack={() => setScreen('invitation')}
            onNext={() => setScreen('review')}
          />
        );
      case 'review':
        return (
          <ReviewStayExtension
            nights={nights}
            nightlyRate={NIGHTLY_RATE}
            checkoutLabel={checkoutLabel}
            onBack={() => setScreen('choose-nights')}
            onNext={() => {}}
          />
        );
    }
  }

  return (
    <section className='mx-4 mt-20 md:mx-0' aria-labelledby={`${id}-title`}>
      <h2
        id={`${id}-title`}
        className='text-[24px] font-[450] leading-7 tracking-[-0.5px]'
      >
        Stay a Little Longer
      </h2>
      <motion.div
        initial={false}
        animate={{ height: height ?? 'auto' }}
        transition={{
          duration: reducedMotion ? 0 : 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className='tabular-nums mx-auto max-w-5/6 sm:max-w-4/6 ring-[0.5px] ring-neutral-200 rounded-xl mt-8 overflow-hidden shadow'
        onKeyDown={event => {
          if (event.key === 'Escape' && screen !== 'invitation') {
            event.stopPropagation();
            setScreen(screen === 'review' ? 'choose-nights' : 'invitation');
          }
        }}
      >
        <div ref={content} tabIndex={-1} className='flow-root p-4 outline-none'>
          <AnimatePresence initial={false}>
            <motion.div
              key={screen}
              initial={{ opacity: reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0 : 0.16,
                ease: 'easeOut',
              }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
