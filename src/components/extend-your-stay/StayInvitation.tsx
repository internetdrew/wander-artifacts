import { Button } from '@base-ui/react/button';

export default function StayInvitation({ onNext }: { onNext: () => void }) {
  return (
    <>
      <p className='font-[550] text-lg'>Checkout is tomorrow at 11 AM</p>
      <p className='text-sm font-[450] mt-0.5 text-neutral-500 text-pretty'>
        Not ready to go yet? You can extend your stay{' '}
        <span className='font-[550]'>up to 3 more nights</span>.
      </p>
      <Button
        onClick={onNext}
        className='mt-8 h-11 w-full cursor-pointer rounded-lg text-white bg-[#202020] hover:bg-[#202020]/95 font-[450] focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-150'
      >
        Explore extra nights
      </Button>
    </>
  );
}
