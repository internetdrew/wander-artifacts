import StayExtensionHeader from './StayExtensionHeader';
import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Button } from '@base-ui/react/button';
import { Dialog } from '@base-ui/react/dialog';
import StayInvoice from './StayInvoice';
import ButtonStateLabel from './ButtonStateLabel';
import { BUTTON_LAYOUT } from './buttonMotion';

const PROCESSING_MS = 4000;
// Seconds from the payment-complete moment. Keep the invoice just behind
// the Charged label and Done button; adjust gap to tune the handoff.
const PAID_TIMING = {
  charge: 0.18,
  done: BUTTON_LAYOUT.duration,
  invoiceGap: 0.04,
  invoiceDuration: 0.48,
  invoiceWiggleDelay: 0.24,
  invoiceWiggleDuration: 0.55,
  invoiceWigglePause: 7,
} as const;
const INVOICE_DELAY =
  Math.max(PAID_TIMING.charge, PAID_TIMING.done) + PAID_TIMING.invoiceGap;

export default function ReviewStayExtension({
  onNext,
  onBack,
  checkoutLabel,
  checkout,
  nights,
  nightlyRate,
}: {
  onNext: () => void;
  onBack: () => void;
  checkoutLabel: string;
  checkout: Date;
  nights: number;
  nightlyRate: number;
}) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'paid'>('idle');
  const reducedMotion = useReducedMotion();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [invoiceRowEntered, setInvoiceRowEntered] = useState(false);
  const [invoiceReturning, setInvoiceReturning] = useState(false);
  const invoiceId = useId();
  const wiggleInvoice =
    invoiceVisible && invoiceRowEntered && !invoiceOpen && !invoiceReturning && !reducedMotion;

  useEffect(() => {
    if (status !== 'processing') return;
    // Demo only: no payment request is sent.
    const timer = window.setTimeout(() => setStatus('paid'), PROCESSING_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'paid') return;
    const timer = window.setTimeout(
      () => setInvoiceVisible(true),
      reducedMotion ? 0 : INVOICE_DELAY * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [status, reducedMotion]);

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

  const stayDetails = [
    {
      label: 'Nights added',
      value: `${nights} ${nights === 1 ? 'night' : 'nights'}`,
    },
    { label: 'Rate per night', value: currency.format(nightlyRate) },
  ];

  return (
    <div
      aria-busy={status === 'processing'}
      onKeyDown={event => {
        if (event.key === 'Escape' && status !== 'idle')
          event.stopPropagation();
      }}
    >
      <StayExtensionHeader
        title={
          status === 'paid'
            ? 'Your stay is extended'
            : 'Review your stay extension'
        }
        announce
      />

      <dl
        aria-label='Stay extension details'
        className='mt-4 space-y-4 rounded-xl bg-[#F9F7F6] p-4 text-sm font-[450]'
      >
        <div className='grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1'>
          <dt className='contents'>
            <span
              aria-hidden='true'
              className='col-start-1 row-start-1 row-span-2 grid size-10 place-items-center rounded-lg bg-[#F3EFED] p-2.5 text-[#202020]'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='size-full'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M8 2v3' />
                <path d='M16 2v3' />
                <rect x='3' y='3' width='18' height='18' rx='2' />
                <path d='M3 9h18' />
              </svg>
            </span>
            <span className='col-start-2 row-start-1 text-neutral-500'>
              New checkout
            </span>
          </dt>
          <dd className='col-start-2 row-start-2 flex items-center justify-between gap-4 font-[550]'>
            <span>{checkoutLabel}</span>
            <span>11 AM</span>
          </dd>
        </div>
        {stayDetails.map(({ label, value }) => (
          <div
            key={label}
            className='flex items-baseline justify-between gap-4'
          >
            <dt className='text-neutral-500'>{label}</dt>
            <dd className='text-right'>{value}</dd>
          </div>
        ))}
        <div className='flex items-baseline justify-between gap-4 border-t border-neutral-200 pt-4 font-[550]'>
          <dt>Total added</dt>
          <dd className='text-right'>
            <span className='text-lg'>
              {currency.format(nightlyRate * nights)}
            </span>
            <span className='mt-1 block text-xs font-normal text-neutral-500'>
              Taxes included
            </span>
          </dd>
        </div>
      </dl>

      <div className='mt-3 min-h-36'>
        <dl
          aria-label='Payment and invoice'
          className='rounded-xl bg-[#ECEFF0] p-4 text-sm font-[450]'
        >
          <div className='grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1'>
            <dt className='contents'>
              <span
                aria-hidden='true'
                className='col-start-1 row-start-1 row-span-2 grid size-10 place-items-center rounded-lg bg-[#D9DFE1] p-2.5 text-[#202020]'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='size-full'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect width='20' height='14' x='2' y='5' rx='2' />
                  <line x1='2' x2='22' y1='10' y2='10' />
                  <path d='M6 14h2' />
                </svg>
              </span>
              <motion.span
                initial={false}
                layout='position'
                layoutDependency={status}
                transition={{
                  duration: reducedMotion ? 0 : PAID_TIMING.charge,
                }}
                className='col-start-2 row-start-1 flex items-baseline text-neutral-500'
              >
                Charg
                <AnimatePresence initial={false}>
                  <motion.span
                    key={status}
                    initial={{
                      opacity: 0,
                      width: 0,
                      y: reducedMotion ? 0 : 4,
                    }}
                    animate={{ opacity: 1, width: 'auto', y: 0 }}
                    exit={{ opacity: 0, width: 0, y: reducedMotion ? 0 : -4 }}
                    className='inline-block overflow-hidden'
                    transition={{
                      duration: reducedMotion ? 0 : PAID_TIMING.charge,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                  >
                    {status === 'processing'
                      ? 'ing'
                      : status === 'paid'
                        ? 'ed'
                        : 'e'}
                  </motion.span>
                </AnimatePresence>
                <span className='whitespace-pre'> to</span>
              </motion.span>
            </dt>
            <dd className='col-start-2 row-start-2 flex items-center font-[450]'>
              <motion.span
                className='grid h-3.5 shrink-0 place-items-center overflow-hidden'
                aria-hidden='true'
                initial={false}
                animate={{
                  width: status === 'idle' ? 0 : '0.875rem',
                  marginRight: status === 'idle' ? 0 : '0.5rem',
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.2,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
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
                          duration: reducedMotion ? 0 : 0.2,
                          delay: reducedMotion ? 0 : 0.04,
                          ease: [0.215, 0.61, 0.355, 1],
                        }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.span>
              Visa ending 4242
            </dd>
          </div>
          <motion.div
            initial={false}
            aria-hidden={!invoiceVisible}
            animate={{
              height: invoiceVisible ? 'auto' : 0,
              marginTop: invoiceVisible ? '1rem' : 0,
              opacity: invoiceVisible ? 1 : 0,
              y: invoiceVisible || reducedMotion ? 0 : -8,
            }}
            transition={{
              duration: reducedMotion ? 0 : PAID_TIMING.invoiceDuration,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              if (invoiceVisible) setInvoiceRowEntered(true);
            }}
            className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 ${invoiceRowEntered || (invoiceVisible && reducedMotion) ? 'overflow-visible' : 'overflow-hidden'} ${!invoiceVisible ? 'invisible' : ''}`}
          >
            <dt className='contents'>
              <span aria-hidden='true' className='col-span-2 row-start-1 h-px bg-[#D9DFE1]' />
              <span className='col-start-1 row-start-2 text-neutral-500'>Get invoice</span>
            </dt>
            <dd className='col-start-2 row-start-2'>
              <Dialog.Root
                open={invoiceOpen}
                onOpenChange={open => {
                  setInvoiceReturning(!open && !reducedMotion);
                  setInvoiceOpen(open);
                }}
              >
                <Dialog.Trigger
                  aria-label='View invoice'
                  className='flex h-10 w-16 cursor-pointer items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2'
                >
                  <motion.span
                    className='flex items-center justify-center'
                    initial={false}
                    animate={{
                      rotate: wiggleInvoice ? [0, -4, 3, -1.5, 0] : 0,
                    }}
                    transition={{
                      duration: reducedMotion
                        ? 0
                        : PAID_TIMING.invoiceWiggleDuration,
                      delay: reducedMotion ? 0 : PAID_TIMING.invoiceWiggleDelay,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      ease: 'easeInOut',
                      repeat: wiggleInvoice ? Infinity : 0,
                      repeatDelay: PAID_TIMING.invoiceWigglePause,
                    }}
                  >
                    {!invoiceOpen && (
                      <motion.div
                        layoutId={reducedMotion ? undefined : invoiceId}
                        transition={{
                          type: 'spring',
                          duration: 0.4,
                          bounce: 0,
                        }}
                        onLayoutAnimationComplete={() =>
                          setInvoiceReturning(false)
                        }
                        aria-hidden='true'
                        className='relative h-7 w-16 border border-[#e5dfd3] bg-[#F9F7F6] shadow-sm'
                        style={{
                          borderRadius: 2,
                          zIndex: invoiceReturning ? 60 : undefined,
                        }}
                      ></motion.div>
                    )}
                  </motion.span>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Backdrop className='fixed inset-0 z-40 bg-black/25' />
                  <Dialog.Viewport className='fixed inset-0 z-50 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center px-4 py-12'>
                      <Dialog.Popup className='pointer-events-none relative w-full max-w-90 md:max-w-100 outline-none'>
                        <Dialog.Title className='sr-only'>
                          Stay extension invoice
                        </Dialog.Title>
                        <Dialog.Description className='sr-only'>
                          Press Escape or click outside the invoice to close.
                        </Dialog.Description>
                        <Dialog.Close className='pointer-events-auto sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:-top-10 focus-visible:right-0 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm focus-visible:outline-2 focus-visible:outline-offset-2'>
                          Close invoice
                        </Dialog.Close>
                        <StayInvoice
                          layoutId={invoiceId}
                          checkout={checkout}
                          nights={nights}
                          nightlyRate={nightlyRate}
                        />
                      </Dialog.Popup>
                    </div>
                  </Dialog.Viewport>
                </Dialog.Portal>
              </Dialog.Root>
            </dd>
          </motion.div>
        </dl>
      </div>
      <p role='status' className='sr-only'>
        {status === 'processing'
          ? 'Processing payment'
          : status === 'paid'
            ? 'Payment complete. Visa ending 4242 charged. Invoice available.'
            : ''}
      </p>

      <div className='mt-8 flex items-center justify-between text-sm font-[550] gap-4'>
        {status !== 'paid' && (
          <Button
            onClick={onBack}
            disabled={status === 'processing'}
            className='px-4 py-2.5 w-fit rounded-full enabled:hover:bg-[#ECEFF0] enabled:cursor-pointer disabled:cursor-default disabled:text-neutral-400 motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-2'
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
          className={`group relative inline-flex px-4 py-2.5 w-fit ml-auto items-center justify-center overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-colors motion-safe:duration-150 ${status === 'processing' ? 'cursor-wait bg-[#d7e5db] text-[#2e6b44]' : status === 'paid' ? 'cursor-pointer bg-[#202020] text-white enabled:hover:bg-black' : 'cursor-pointer bg-[#00733D] text-white enabled:hover:bg-[#005A2E]'}`}
        >
          <ButtonStateLabel label={label} reducedMotion={!!reducedMotion} />
          <motion.span
            aria-hidden='true'
            className={`pointer-events-none absolute inset-0 grid place-items-center text-white ${status === 'paid' ? 'bg-[#202020] group-hover:bg-black' : 'bg-[#2e6b44]'}`}
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
            <ButtonStateLabel label={label} reducedMotion={!!reducedMotion} />
          </motion.span>
        </Button>
      </div>
    </div>
  );
}
