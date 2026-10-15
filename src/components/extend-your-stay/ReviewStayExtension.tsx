import { Button } from '@base-ui/react/button';

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
  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  const rows = [
    { label: 'New checkout', value: `${checkoutLabel} at 11 AM` },
    {
      label: 'Nights added',
      value: `${nights} ${nights === 1 ? 'night' : 'nights'}`,
    },
    { label: 'Rate', value: `${currency.format(nightlyRate)} per night` },
    { label: 'Total added', value: currency.format(nightlyRate * nights) },
    { label: 'Charge to', value: 'Visa ending 4242' },
  ];

  return (
    <>
      <p className='font-[550] text-lg'>Review your stay extension</p>

      <dl className='mt-6 space-y-4 text-sm font-[450]'>
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className={`flex items-baseline justify-between gap-4 ${label === 'Total added' ? 'border-t border-neutral-200 pt-4 font-[550]' : ''}`}
          >
            <dt className={label === 'Total added' ? 'text-[#202020]' : 'text-neutral-500'}>{label}</dt>
            <dd className='text-right'>
              {value}
              {label === 'Total added' && <span className='mt-1 block text-xs font-normal text-neutral-500'>Taxes included</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className='mt-8 space-y-2'>
        <Button
          onClick={onNext}
          className='inline-flex h-11 w-full items-center justify-center cursor-pointer rounded-full hover:bg-[#005A2E] text-white bg-[#00733D] font-[450] focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-150'
        >
          Confirm and pay {currency.format(nightlyRate * nights)}
        </Button>
        <Button
          onClick={onBack}
          className='inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2'
        >
          Back
        </Button>
      </div>
    </>
  );
}
