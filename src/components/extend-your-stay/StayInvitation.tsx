import { Button } from '@base-ui/react/button';

export default function StayInvitation({
  onNext,
  checkoutLabel,
}: {
  onNext: () => void;
  checkoutLabel: string;
}) {
  return (
    <>
      <p className='font-[550] text-lg'>Checkout is {checkoutLabel} at 11 AM</p>
      <p className='text-sm font-[450] mt-0.5 text-neutral-500 text-pretty'>
        Want to stay longer? You can extend your stay{' '}
        <span className='font-[550]'>up to 3 extra nights</span>.
      </p>
      <div className='flex mt-8 text-sm'>
        <Button
          onClick={onNext}
          className='py-2.5 px-4 w-fit ml-auto cursor-pointer rounded-full text-white bg-[#202020] hover:bg-[#202020]/95 font-[450] focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-150'
        >
          Explore extra nights
        </Button>
      </div>
    </>
  );
}
