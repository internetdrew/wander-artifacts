export default function StayDetails({
  checkoutLabel,
  nights,
  nightlyRate,
}: {
  checkoutLabel: string;
  nights: number;
  nightlyRate: number;
}) {
  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  const stayDetails = [
    {
      label: 'Nights added',
      value: `${nights} ${nights === 1 ? 'night' : 'nights'}`,
    },
    { label: 'Rate per night', value: currency.format(nightlyRate) },
  ];

  return (
    <dl
      aria-label='Stay extension details'
      className='mt-4 space-y-3 rounded-xl bg-[#F9F7F6] p-2.5 text-sm font-[450]'
    >
      <div className='flex items-baseline justify-between gap-4'>
        <dt className='text-neutral-500'>New checkout</dt>
        <dd className='text-right'>{checkoutLabel}, 11 AM</dd>
      </div>
      {stayDetails.map(({ label, value }) => (
        <div key={label} className='flex items-baseline justify-between gap-4'>
          <dt className='text-neutral-500'>{label}</dt>
          <dd className='text-right'>{value}</dd>
        </div>
      ))}
      <div className='flex items-baseline justify-between gap-4 border-t border-neutral-200 pt-4 font-[550]'>
        <dt className='font-[450]'>Total added</dt>
        <dd className='text-right'>
          <span className='text-lg'>
            {currency.format(nightlyRate * nights)}
          </span>
          <span className='block text-xs font-normal text-neutral-500'>
            Taxes included
          </span>
        </dd>
      </div>
    </dl>
  );
}
