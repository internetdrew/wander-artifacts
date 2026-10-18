export default function StayDetails({ checkoutLabel, nights, nightlyRate }: {
  checkoutLabel: string;
  nights: number;
  nightlyRate: number;
}) {
  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
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

  );
}
