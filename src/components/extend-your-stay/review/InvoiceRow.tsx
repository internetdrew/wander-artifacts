import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Dialog } from '@base-ui/react/dialog';
import StayInvoice from '../invoice/StayInvoice';
import { PAID_TIMING } from './paymentTiming';

export default function InvoiceRow({ invoiceVisible, checkout, nights, nightlyRate }: {
  invoiceVisible: boolean;
  checkout: Date;
  nights: number;
  nightlyRate: number;
}) {
  const reducedMotion = useReducedMotion();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceRowEntered, setInvoiceRowEntered] = useState(false);
  const [invoiceReturning, setInvoiceReturning] = useState(false);
  const invoiceId = useId();
  const wiggleInvoice =
    invoiceVisible && invoiceRowEntered && !invoiceOpen && !invoiceReturning && !reducedMotion;

  return (
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
  );
}
