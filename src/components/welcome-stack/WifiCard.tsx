import { Button } from '@base-ui/react';
import WifiSignal from './WifiSignal';

const WifiCard = () => {
  return (
    <div
      className='bg-white md:max-w-88 rounded-2xl shadow-md font-[450] p-4 pt-3'
      style={{
        boxShadow:
          '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)',
      }}
    >
      <h3 className='font-[550] text-lg text-[#202020]'>Get connected</h3>
      <div className='my-8 flex justify-center'>
        <WifiSignal />
      </div>

      <div className='p-3 pt-2 bg-neutral-100 rounded-lg mt-4 font-[450] space-y-2 text-sm'>
        <div>
          <p className='text-neutral-500'>Network</p>
          <p className='tracking-wide'>WatchmereGuest</p>
        </div>
        <div>
          <p className='text-neutral-500'>Password</p>
          <p className='tracking-wide'>slowmornings</p>
        </div>
      </div>
      <Button className='bg-[#202020] mt-8 text-white w-full rounded-full py-2'>
        Copy password
      </Button>

      <div className='h-px bg-neutral-200 my-4'></div>

      <div className='flex items-start gap-2'>
        <div className='size-8 shrink-0 grid place-items-center bg-neutral-100 p-1 ring-[0.5px] ring-neutral-300/50 rounded-full'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='size-4 stroke-[#202020]'
          >
            <path d='M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z' />
            <path d='M20.054 15.987H3.946' />
          </svg>
        </div>
        <div className='text-sm'>
          <p>Bringing work along?</p>
          <p className='text-neutral-500 text-pretty'>
            There's a desk in the upstairs study.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WifiCard;
