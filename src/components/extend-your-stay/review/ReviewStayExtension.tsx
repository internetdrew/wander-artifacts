import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import StayExtensionHeader from '../shared/StayExtensionHeader';
import StayDetails from './StayDetails';
import PaymentDetails from './PaymentDetails';
import InvoiceRow from './InvoiceRow';
import ReviewActions from './ReviewActions';
import {
  PROCESSING_MS,
  type PaymentStatus,
} from './paymentTiming';

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
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const review = useRef<HTMLDivElement>(null);
  const confirmationHeading = useRef<HTMLHeadingElement>(null);
  const [invoiceAvailable, setInvoiceAvailable] = useState(false);
  const invoiceVisible = status === 'paid';

  useLayoutEffect(() => {
    if (status !== 'paid') return;
    // Move focus as the confirmation replaces review, not after an animation.
    // If the user has moved elsewhere during processing, leave their focus alone.
    if (review.current?.contains(document.activeElement)) {
      confirmationHeading.current?.focus({ preventScroll: true });
    }
  }, [status]);

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

  return (
    <div
      ref={review}
      aria-busy={status === 'processing'}
      onKeyDown={event => {
        if (event.key === 'Escape' && status !== 'idle')
          event.stopPropagation();
      }}
    >
      <StayExtensionHeader
        ref={confirmationHeading}
        tabIndex={status === 'paid' ? -1 : undefined}
        title={
          status === 'paid'
            ? 'Your stay is extended'
            : 'Review your stay extension'
        }
      />

      <StayDetails
        checkoutLabel={checkoutLabel}
        nights={nights}
        nightlyRate={nightlyRate}
      />

      <div className='mt-3 min-h-32'>
        <dl
          aria-label='Payment and invoice'
          className='rounded-lg bg-[#ECEFF0] p-2.5 text-sm font-[450]'
        >
          <PaymentDetails status={status} />
          <InvoiceRow
            invoiceVisible={invoiceVisible}
            onAvailable={() => setInvoiceAvailable(true)}
            checkout={checkout}
            nights={nights}
            nightlyRate={nightlyRate}
          />
        </dl>
      </div>
      <p role='status' className='sr-only'>
        {status === 'processing'
          ? 'Processing payment'
          : status === 'paid'
            ? invoiceAvailable
              ? 'Payment complete. Visa ending 4242 charged. Invoice available.'
              : 'Payment complete. Visa ending 4242 charged.'
            : ''}
      </p>

      <ReviewActions
        status={status}
        label={label}
        onBack={onBack}
        onNext={onNext}
        onPay={() => setStatus('processing')}
      />
    </div>
  );
}
