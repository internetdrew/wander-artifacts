import { Button } from '@base-ui/react';
import { useEffect, useRef, useState } from 'react';
import watchmere from '../../../assets/home-0.webp';
import WelcomeAudioPlayer from './WelcomeAudioPlayer';

const WelcomeCard = () => {
  const [showCheck, setShowCheck] = useState(false);
  const [copyError, setCopyError] = useState('');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyAddress() {
    if (pending.current) return;
    pending.current = true;
    setCopyError('');
    try {
      await navigator.clipboard.writeText('18 Woodside Lane');
      if (!mounted.current) return;
      setShowCheck(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setShowCheck(false), 2000);
    } catch {
      if (mounted.current) {
        setCopyError('Could not copy the address. Please try again.');
      }
    } finally {
      pending.current = false;
    }
  }

  return (
    <div
      className='bg-white md:max-w-4/7 rounded-2xl shadow-md'
      style={{
        boxShadow:
          '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)',
      }}
    >
      <div className='relative h-28 overflow-hidden rounded-t-2xl'>
        <img
          src={watchmere}
          alt='Watchmere coastal home in daylight'
          width={1449}
          height={1085}
          className='block h-full w-full object-cover object-center'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-linear-to-b from-[#202020]/40 to-transparent'
        />
      </div>

      <div className='font-[450] p-4 pt-3'>
        <span className='block text-xs leading-4 text-neutral-500'>
          Welcome to
        </span>
        <h3 className='mt-0.5 text-xl leading-6 font-[550] tracking-[-0.2px] text-[#202020]'>
          Watchmere
        </h3>

        <div className='mt-2 flex items-center gap-1.5 text-[13px] leading-5 text-neutral-500'>
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
            className='size-3.5 shrink-0'
          >
            <path d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' />
            <circle cx='12' cy='10' r='3' />
          </svg>
          <span>18 Woodside Lane</span>
          <Button
            type='button'
            aria-label={showCheck ? 'Address copied' : 'Copy address'}
            onClick={copyAddress}
            className='relative ml-1 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            <span
              className='t-icon-swap'
              data-state={showCheck ? 'b' : 'a'}
              aria-hidden='true'
            >
              <span className='t-icon' data-icon='a'>
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
                  className='size-3.5'
                  aria-hidden='true'
                >
                  <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
                  <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
                </svg>
              </span>
              <span className='t-icon text-[#00733D]' data-icon='b'>
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
                  className='size-3.5'
                >
                  <path d='M20 6 9 17l-5-5' />
                </svg>
              </span>
            </span>
          </Button>
          <span role='status' className='sr-only'>
            {copyError || (showCheck ? 'Address copied to clipboard.' : '')}
          </span>
        </div>

        <WelcomeAudioPlayer />

        <div className='flex items-center'>
          <div className='font-[450] flex flex-col flex-1'>
            <span className='text-neutral-500 text-xs'>Arrive on</span>
            <span className='text-sm font-[550]'>Tue, Oct 20</span>
            <span className='text-neutral-500 text-xs'>at 4:00 pm</span>
          </div>
          <div className='font-[450] flex flex-col flex-1 border-l border-neutral-200 pl-4'>
            <span className='text-neutral-500 text-xs'>Leave on</span>
            <span className='text-sm font-[550]'>Fri, Oct 23</span>
            <span className='text-neutral-500 text-xs'>at 11:00 am</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
