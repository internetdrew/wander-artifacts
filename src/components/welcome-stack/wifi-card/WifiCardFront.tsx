import { Button } from '@base-ui/react';
import type { Ref } from 'react';
import WifiSignal from './WifiSignal';
import CopyPasswordButton from './CopyPasswordButton';

const WIFI_PASSWORD = 'slowmornings';

interface WifiCardFrontProps {
  hidden: boolean;
  onFlip: () => void;
  buttonRef: Ref<HTMLButtonElement>;
}

export default function WifiCardFront({
  hidden,
  onFlip,
  buttonRef,
}: WifiCardFrontProps) {
  return (
    <div
      className='col-start-1 row-start-1 bg-white rounded-2xl shadow-md p-4 pt-3 backface-hidden [-webkit-backface-visibility:hidden] transform-[rotateY(0deg)_translateZ(0)]'
      aria-hidden={hidden}
      inert={hidden}
      style={{
        boxShadow:
          '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)',
      }}
    >
      <h3 className='font-[550] text-lg text-[#202020]'>Get connected</h3>
      <div className='my-8 flex justify-center'>
        <WifiSignal />
      </div>

      <div className='p-3 pt-2 bg-[#ECEFF0] rounded-lg mt-4 font-[450] space-y-2 text-sm'>
        <div>
          <p className='text-neutral-500'>Network</p>
          <p className='tracking-wide'>WatchmereGuest</p>
        </div>
        <div>
          <p className='text-neutral-500'>Password</p>
          <p className='tracking-wide'>{WIFI_PASSWORD}</p>
        </div>
      </div>
      <CopyPasswordButton password={WIFI_PASSWORD} />
      <Button
        ref={buttonRef}
        type='button'
        onClick={onFlip}
        aria-label='Show Wi-Fi QR code'
        className='mt-2 py-2.5 w-full bg-[#ECEFF0] ring-[0.5px] ring-[#D9DFE1]/50 cursor-pointer text-sm rounded-full hover:bg-[#D9DFE1] duration-150 transition-colors'
      >
        Flip for QR code
      </Button>

      <div className='h-px bg-neutral-200 my-4'></div>

      <div className='flex items-start gap-4'>
        <div className='size-10 shrink-0 grid place-items-center bg-[#ECEFF0] p-1 ring-[0.5px] ring-neutral-300/50 rounded-full'>
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
            className='size-5 stroke-[#202020]'
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
}
