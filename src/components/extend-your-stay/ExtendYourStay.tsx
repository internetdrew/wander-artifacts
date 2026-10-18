import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import StayInvitation from './invitation/StayInvitation';
import ChooseNights from './choose-nights/ChooseNights';
import ReviewStayExtension from './review/ReviewStayExtension';

const NIGHTLY_RATE = 1150;
const RESIZE_TRANSITION = {
  type: 'spring',
  bounce: 0,
} as const;
const MIN_RESIZE_DURATION = 0.24;
const MAX_RESIZE_DURATION = 0.3;
const FULL_RESIZE_DISTANCE = 400;
// Keep the content handoff close to the resize's settling time.
const CONTENT_ENTER_DURATION = 0.24;
const CONTENT_EXIT_DURATION = 0.19;
const CONTENT_ENTER_DELAY = 0.04;
const CONTENT_EASE = [0.215, 0.61, 0.355, 1] as const;

type View = 'invitation' | 'choose-nights' | 'review';

export default function ExtendYourStay() {
  const [view, setView] = useState<View>('invitation');
  const [{ nights, direction }, setSelection] = useState({
    nights: 1,
    direction: 1,
  });
  const [resizing, setResizing] = useState(false);
  const targetHeight = useRef(0);
  const displayedHeight = useRef(0);
  const [resize, setResize] = useState({
    height: 0,
    duration: MIN_RESIZE_DURATION,
  });

  const changeNights = (next: number) =>
    setSelection(previous => ({
      nights: Math.min(3, Math.max(1, next)),
      direction: Math.sign(next - previous.nights) || previous.direction,
    }));
  const [today] = useState(() => new Date());
  const currentCheckout = new Date(today);
  currentCheckout.setHours(11, 0, 0, 0);
  currentCheckout.setDate(currentCheckout.getDate() + 1);
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

  const updateHeight = useCallback((height: number) => {
    if (!height || Math.abs(height - targetHeight.current) < 0.5) return;

    const distance = Math.abs(height - displayedHeight.current);
    const duration =
      MIN_RESIZE_DURATION +
      (MAX_RESIZE_DURATION - MIN_RESIZE_DURATION) *
        Math.min(distance / FULL_RESIZE_DISTANCE, 1);

    if (!targetHeight.current) displayedHeight.current = height;
    targetHeight.current = height;
    setResize({ height, duration });
  }, []);

  useLayoutEffect(() => {
    // View changes get a synchronous measurement so resize and entry can
    // start together. Later changes use the observer's existing measurement.
    updateHeight(content.current?.getBoundingClientRect().height ?? 0);
  }, [view, updateHeight]);

  useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) updateHeight(entry.borderBoxSize[0].blockSize);
    });
    observer.observe(node, { box: 'border-box' });
    return () => observer.disconnect();
  }, [updateHeight]);

  const transition = {
    ...RESIZE_TRANSITION,
    duration: reducedMotion ? 0 : resize.duration,
  };

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
            checkoutLabel='Tomorrow'
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
              setSelection({ nights: 1, direction: 1 });
              setView('invitation');
            }}
          />
        );
    }
  }

  return (
    <section className='mx-4 md:mx-0' aria-label='Extend your stay'>
      <motion.div
        initial={false}
        animate={{ height: resize.height || 'auto' }}
        transition={transition}
        onUpdate={latest => {
          if (typeof latest.height === 'number') {
            displayedHeight.current = latest.height;
          }
        }}
        onAnimationStart={() => {
          if (!reducedMotion) setResizing(true);
        }}
        onAnimationComplete={() => setResizing(false)}
        className={`relative tabular-nums mx-auto ring-[0.5px] ring-neutral-200 shadow rounded-2xl ${resizing && !reducedMotion ? 'overflow-hidden' : 'overflow-visible'}`}
      >
        <div
          ref={content}
          tabIndex={-1}
          className='relative flow-root p-4 outline-none'
        >
          <AnimatePresence initial={false} mode='popLayout'>
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: reducedMotion ? 1 : 0.99,
                transition: {
                  type: 'tween',
                  duration: reducedMotion ? 0 : CONTENT_EXIT_DURATION,
                  ease: CONTENT_EASE,
                },
              }}
              transition={{
                type: 'tween',
                duration: reducedMotion ? 0 : CONTENT_ENTER_DURATION,
                delay: reducedMotion ? 0 : CONTENT_ENTER_DELAY,
                ease: CONTENT_EASE,
              }}
              style={{ transformOrigin: 'top center' }}
              className='flow-root'
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
