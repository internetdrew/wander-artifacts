import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';
import { Button } from '@base-ui/react/button';

const PROCESSING_MS = 4000;
const BUTTON_LAYOUT = { type: 'spring', duration: 0.25, bounce: 0 } as const;

export default function ReviewStayExtension({
  onNext,
  onBack,
  checkoutLabel,
  nights,
  nightlyRate,
}: {
  onNext: () => void;
  onBack: () => void;
  checkoutLabel: string;
  nights: number;
  nightlyRate: number;
}) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'paid'>('idle');
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (status !== 'processing') return;
    // Demo only: no payment request is sent.
    const timer = window.setTimeout(() => setStatus('paid'), PROCESSING_MS);
    return () => window.clearTimeout(timer);
  }, [status]);
  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  const label =
    status === 'processing'
      ? 'Processing payment…'
      : status === 'paid'
        ? 'Done'
        : `Confirm and pay ${currency.format(nightlyRate * nights)}`;

  const rows = [
    { label: 'New checkout', value: `${checkoutLabel} at 11 AM` },
    {
      label: 'Nights added',
      value: `${nights} ${nights === 1 ? 'night' : 'nights'}`,
    },
    { label: 'Rate', value: `${currency.format(nightlyRate)} per night` },
    { label: 'Total added', value: currency.format(nightlyRate * nights) },
  ];

  return (
    <div
      aria-busy={status === 'processing'}
      onKeyDown={event => {
        if (event.key === 'Escape' && status !== 'idle')
          event.stopPropagation();
      }}
    >
      <p className='font-[550] text-lg'>Review your stay extension</p>

      <dl className='mt-8 space-y-4 text-sm font-[450]'>
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className={`flex items-baseline justify-between gap-4 ${label === 'Total added' ? 'border-t border-neutral-200 pt-4 font-[550]' : ''}`}
          >
            <dt
              className={
                label === 'Total added' ? 'text-[#202020]' : 'text-neutral-500'
              }
            >
              {label}
            </dt>
            <dd className='text-right'>
              {value}
              {label === 'Total added' && (
                <span className='mt-1 block text-xs font-normal text-neutral-500'>
                  Taxes included
                </span>
              )}
            </dd>
          </div>
        ))}
        <div className='flex items-center justify-between gap-4'>
          <motion.dt
            initial={false}
            layout='position'
            layoutDependency={status}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className='flex items-baseline text-neutral-500'
          >
            Charge
            <AnimatePresence initial={false}>
              {status === 'paid' && (
                <motion.span
                  key='charged'
                  initial={{ opacity: 0, width: 0, y: reducedMotion ? 0 : 4 }}
                  animate={{ opacity: 1, width: 'auto', y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.18,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                >
                  d
                </motion.span>
              )}
            </AnimatePresence>
            <span className='whitespace-pre'> to</span>
          </motion.dt>
          <dd className='flex items-center gap-2 text-right font-[450]'>
            <span
              className='grid size-3.5 place-items-center'
              aria-hidden='true'
            >
              <AnimatePresence initial={false}>
                {status === 'processing' && (
                  <motion.span
                    key='spinner'
                    className='col-start-1 row-start-1'
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.12,
                      ease: 'easeOut',
                    }}
                  >
                    <motion.span
                      className='block size-3.5 rounded-full border-2 border-[#3d8941]/20 border-t-[#3d8941]'
                      animate={{
                        transform: reducedMotion
                          ? 'rotate(0deg)'
                          : 'rotate(360deg)',
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.75,
                        repeat: reducedMotion ? 0 : Infinity,
                        ease: 'linear',
                      }}
                    />
                  </motion.span>
                )}
                {status === 'paid' && (
                  <motion.svg
                    key='paid'
                    viewBox='0 0 16 16'
                    className='col-start-1 row-start-1 size-3.5'
                    initial={{ opacity: reducedMotion ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reducedMotion ? 0 : 0.15 }}
                  >
                    <circle cx='8' cy='8' r='8' className='fill-[#3d8941]' />
                    <motion.path
                      d='M4.2 8.2 6.7 10.7 11.8 5.4'
                      fill='none'
                      stroke='white'
                      strokeWidth='1.8'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      initial={{ pathLength: reducedMotion ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.28,
                        delay: reducedMotion ? 0 : 0.08,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
            Visa ending 4242
          </dd>
        </div>
      </dl>
      <p role='status' className='sr-only'>
        {status === 'processing'
          ? 'Processing payment'
          : status === 'paid'
            ? 'Payment complete. Visa ending 4242 charged.'
            : ''}
      </p>

      <div className='mt-8 flex items-center justify-between text-sm gap-4'>
        {status !== 'paid' && (
          <Button
            onClick={onBack}
            disabled={status === 'processing'}
            className='px-4 py-2.5 w-fit rounded-full hover:bg-neutral-200 enabled:cursor-pointer disabled:cursor-default disabled:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            Back
          </Button>
        )}
        <Button
          render={
            <motion.button
              layout={!reducedMotion}
              transition={{ layout: BUTTON_LAYOUT }}
              style={{ borderRadius: 9999 }}
            />
          }
          onClick={() =>
            status === 'paid' ? onNext() : setStatus('processing')
          }
          disabled={status === 'processing'}
          aria-busy={status === 'processing'}
          aria-label={label}
          className={`relative inline-flex px-4 py-2.5 w-fit ml-auto items-center justify-center overflow-hidden font-[450] focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-colors motion-safe:duration-150 ${status === 'processing' ? 'cursor-wait bg-[#d7e5db] text-[#2e6b44]' : status === 'paid' ? 'cursor-pointer bg-[#2e6b44] text-white' : 'cursor-pointer bg-[#00733D] text-white enabled:hover:bg-[#005A2E]'}`}
        >
          <PaymentLabel label={label} reducedMotion={!!reducedMotion} />
          <motion.span
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 grid place-items-center bg-[#2e6b44] text-white'
            initial={false}
            animate={{
              clipPath:
                status === 'idle' || reducedMotion
                  ? 'inset(0 100% 0 0)'
                  : 'inset(0 0% 0 0)',
            }}
            transition={{
              duration:
                status === 'processing' && !reducedMotion
                  ? PROCESSING_MS / 1000
                  : 0,
              ease: 'linear',
            }}
          >
            <PaymentLabel label={label} reducedMotion={!!reducedMotion} />
          </motion.span>
        </Button>
      </div>
    </div>
  );
}

function PaymentLabel({ label, reducedMotion }: { label: string; reducedMotion: boolean }) {
  return (
    <AnimatePresence initial={false} mode='popLayout'>
      <motion.span
        key={label}
        layout={reducedMotion ? false : 'position'}
        className='inline-block whitespace-nowrap'
        initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -4, transition: { duration: 0.1 } }}
        transition={{
          layout: BUTTON_LAYOUT,
          duration: 0.15,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}
