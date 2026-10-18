import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import StayExtensionHeader from '../shared/StayExtensionHeader';
import StayDetails from './StayDetails';
import PaymentDetails from './PaymentDetails';
import InvoiceRow from './InvoiceRow';
import ReviewActions from './ReviewActions';
import {
  PROCESSING_MS,
  INVOICE_DELAY,
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
  const reducedMotion = useReducedMotion();
  const [invoiceVisible, setInvoiceVisible] = useState(false);

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
            ? 'Payment complete. Visa ending 4242 charged. Invoice available.'
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
