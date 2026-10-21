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
    title: 'Temperature control',
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
    title: 'Let the light in. Or out',
    subtitle:
      'The bedroom shades are controlled by the remote on each bedside table.',
  },
  {
    icon: <BlanketIcon />,
    title: 'An extra layer of cozy',
    subtitle: 'Find spare blankets in the basket beside the sofa.',
  },
  {
    icon: <TowelIcon />,
    title: 'Fresh towels, within reach',
    subtitle: 'Help yourself from the linen cupboard in the hallway.',
  },
];

const SettleInCard = () => {
  return (
    <div
      className='bg-white md:max-w-88 rounded-2xl shadow-md font-[450] p-4 pt-3'
      style={{
        boxShadow:
          '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)',
      }}
    >
      <h3 className='font-[550] text-lg text-[#202020]'>
        Make yourself at home...
      </h3>

      <div className='mt-8 space-y-4'>
        {hints.map((hint, i) => (
          <div key={`hint-${i}`}>
            <div className='flex items-center gap-4'>
              <div className='size-10 shrink-0 grid place-items-center bg-[#ECEFF0] p-1 ring-[0.5px] ring-neutral-300/50 rounded-full'>
                {hint.icon}
              </div>
              <div className='text-sm'>
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
