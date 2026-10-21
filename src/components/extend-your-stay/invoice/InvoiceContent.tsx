import type { Ref } from 'react';
import InvoiceWanderLogo from './InvoiceGlobe';

export default function InvoiceContent({
  date,
  issued,
  nightsLabel,
  paid,
  ref,
  animateLogo = false,
}: {
  ref?: Ref<HTMLDivElement>;
  animateLogo?: boolean;
  date: string;
  issued: string;
  nightsLabel: string;
  paid: string;
}) {
  return (
    <div ref={ref} className='invoice-content'>
      <header className='flex items-start justify-between gap-3'>
        <div>
          <h3 className='font-serif text-[28px] leading-tight tracking-tight'>
            Invoice
          </h3>
          <p className='mt-2 text-xs text-[#78716c]'>
            Date of issue <span className='text-[#1c1917]'>{issued}</span>
          </p>
          <p className='mt-1 text-xs text-[#78716c]'>
            Stay extension · Paid in full
          </p>
        </div>
        <InvoiceWanderLogo animationReady={animateLogo} />
      </header>
      <div className='mt-6 grid grid-cols-2 gap-5 text-xs leading-relaxed'>
        <div>
          <p className='text-[13px] font-semibold'>Watchmere</p>
          <p className='mt-1 text-[#57534e]'>A little more time away.</p>
          <p className='mt-5 text-[13px] font-semibold'>Payment method</p>
          <p className='mt-1 text-[#57534e]'>Visa ending 4242</p>
        </div>
        <div>
          <p className='text-[13px] font-semibold'>New checkout</p>
          <p className='mt-1'>{date}</p>
          <p className='text-[#57534e]'>11 AM</p>
        </div>
      </div>
      <div className='mt-auto'>
        <div className='flex justify-between gap-4 border-y border-[#e7e5e4] py-3 text-[13px]'>
          <span>{nightsLabel}</span>
          <span className='font-medium'>{paid}</span>
        </div>
        <div className='flex justify-between py-3 text-sm font-semibold'>
          <span>Total paid</span>
          <span>{paid}</span>
        </div>
        <p className='text-xs text-[#78716c]'>Taxes included</p>
      </div>
    </div>
  );
}
