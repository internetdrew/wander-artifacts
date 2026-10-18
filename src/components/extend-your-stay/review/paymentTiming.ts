import { BUTTON_LAYOUT } from './buttonMotion';

export type PaymentStatus = 'idle' | 'processing' | 'paid';

export const PROCESSING_MS = 4000;
// Seconds from the payment-complete moment. Keep the invoice just behind
// the Charged label and Done button; adjust gap to tune the handoff.
export const PAID_TIMING = {
  charge: 0.18,
  done: BUTTON_LAYOUT.duration,
  invoiceGap: 0.04,
  invoiceDuration: 0.48,
  invoiceWiggleDelay: 0.24,
  invoiceWiggleDuration: 0.55,
  invoiceWigglePause: 7,
} as const;
export const INVOICE_DELAY =
  Math.max(PAID_TIMING.charge, PAID_TIMING.done) + PAID_TIMING.invoiceGap;

