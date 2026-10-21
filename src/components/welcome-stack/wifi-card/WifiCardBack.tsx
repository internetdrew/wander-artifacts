import { Button } from '@base-ui/react';
import type { Ref } from 'react';
import wifiQr from '../../../assets/watchmere-wifi-qr.svg';

interface WifiCardBackProps {
  hidden: boolean;
  onFlip: () => void;
  buttonRef: Ref<HTMLButtonElement>;
}

export default function WifiCardBack({
  hidden,
  onFlip,
  buttonRef,
}: WifiCardBackProps) {
  return (
    <div
      aria-hidden={hidden}
      inert={hidden}
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)' }}
      className='col-start-1 row-start-1 flex flex-col bg-white rounded-2xl p-4 pt-3 pb-6 backface-hidden [-webkit-backface-visibility:hidden] transform-[rotateY(180deg)_translateZ(0)]'
    >
      <h3 className='font-[550] text-lg text-[#202020]'>Scan to connect</h3>
      <p className='text-neutral-500 text-[13px] leading-[19px]'>
        Scan with another device's camera to join Wi-Fi.
      </p>
      <div className='flex flex-col flex-1 items-center justify-center'>
        <img
          src={wifiQr}
          width={256}
          height={256}
          alt='Wi-Fi connection QR code for WatchmereGuest'
          className='w-full max-w-64'
        />
        {/* The SVG includes about 28px of white clearance below the code. */}
        <p className='-mt-4 text-center text-xs text-neutral-500'>WatchmereGuest</p>
      </div>
      <Button
        ref={buttonRef}
        type='button'
        onClick={onFlip}
        className='w-full bg-[#ECEFF0] ring-[0.5px] ring-[#D9DFE1]/50 cursor-pointer rounded-full py-2.5 text-sm transition-colors duration-150 hover:bg-[#D9DFE1] focus-visible:outline-2 focus-visible:outline-offset-2'
      >
        Back to password
      </Button>
    </div>
  );
}
