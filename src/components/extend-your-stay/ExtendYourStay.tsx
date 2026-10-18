import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import StayInvitation from './invitation/StayInvitation';
import ChooseNights from './choose-nights/ChooseNights';
import ReviewStayExtension from './review/ReviewStayExtension';

const NIGHTLY_RATE = 1150;
const VIEW_TRANSITION = {
  type: 'tween',
  ease: [0.455, 0.03, 0.515, 0.955],
} as const;
const MIN_RESIZE_DURATION = 0.15;
const MAX_RESIZE_DURATION = 0.27;
const FULL_RESIZE_DISTANCE = 400;

type View = 'invitation' | 'choose-nights' | 'review';

export default function ExtendYourStay() {
  const id = useId();
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
    const duration = MIN_RESIZE_DURATION +
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
    ...VIEW_TRANSITION,
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
    <section
      className='mx-4 mt-20 min-h-150 md:mx-0'
      aria-labelledby={`${id}-title`}
    >
      <h2
        id={`${id}-title`}
        className='text-xl font-[550] leading-7 tracking-[-0.5px]'
      >
        Stay a Little Longer
      </h2>
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
        className={`relative tabular-nums mx-auto sm:max-w-4/6 ring-1 ring-neutral-200/80 rounded-2xl mt-8 ${resizing && !reducedMotion ? 'overflow-hidden' : 'overflow-visible'}`}
      >
        <div
          ref={content}
          tabIndex={-1}
          className='relative flow-root p-4 outline-none'
        >
          <AnimatePresence initial={false} mode='popLayout' custom={transition}>
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit='exit'
              variants={{
                exit: (exitTransition: typeof transition) => ({
                  opacity: 0,
                  scale: reducedMotion ? 1 : 0.985,
                  transition: {
                    ...exitTransition,
                    opacity: {
                      ...exitTransition,
                      duration: exitTransition.duration * 0.8,
                    },
                  },
                }),
              }}
              transition={transition}
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
