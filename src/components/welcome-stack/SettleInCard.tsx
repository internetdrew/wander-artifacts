import { BlanketIcon, TowelIcon } from './AmenityIcons';

const hints = [
  {
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='stroke-[#202020] size-5'
      >
        <path d='M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z' />
      </svg>
    ),
    title: 'Temperature',
    subtitle: 'Adjust the thermostat in the living room hallway.',
  },
  {
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='stroke-[#202020] size-5'
      >
        <path d='M2 4h20' />
        <path d='M4 4v16h6c0-3-2-5-2-8s2-5 2-8' />
        <path d='M20 4v16h-6c0-3 2-5 2-8s-2-5-2-8' />
      </svg>
    ),
    title: 'Bedroom shades',
    subtitle: 'Use the remote on each bedside table.',
  },
  {
    icon: <BlanketIcon />,
    title: 'Extra blankets',
    subtitle: 'In the basket beside the sofa.',
  },
  {
    icon: <TowelIcon />,
    title: 'Fresh towels',
    subtitle: 'In the hallway linen cupboard.',
  },
];

const SettleInCard = () => {
  return (
    <div className='flex min-h-full flex-col bg-white md:max-w-88 rounded-2xl font-[450] p-4 pt-3 pb-6'>
      <h3 className='font-[550] text-lg text-[#202020]'>
        Make yourself at home
      </h3>

      <div className='flex flex-1 flex-col justify-center gap-6 py-6'>
        {hints.map((hint, i) => (
          <div key={`hint-${i}`}>
            <div className='flex items-start gap-4'>
              <div className='mt-0.5 size-9 shrink-0 grid place-items-center bg-[#ECEFF0] p-1 ring-[0.5px] ring-neutral-300/50 rounded-full'>
                {hint.icon}
              </div>
              <div className='text-[13px] leading-4.75'>
                <p>{hint.title}</p>
                <p className='text-neutral-500'>{hint.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettleInCard;
