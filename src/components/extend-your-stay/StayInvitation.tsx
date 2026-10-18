import StayExtensionHeader from './StayExtensionHeader';
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
      <p className='font-[450] text-sm text-neutral-500 text-pretty'>
        Your checkout
      </p>
      <StayExtensionHeader title={`${checkoutLabel} at 11 AM`} />
      <div className='mt-4 flex items-center justify-between text-sm gap-3'>
        <p className='text-neutral-500 font-[450]'>
          Stay up to 3 extra nights.
        </p>
        <Button
          onClick={onNext}
          className='py-2.5 px-4 w-fit cursor-pointer rounded-full text-white bg-[#202020] hover:bg-[#202020]/95 font-[550] focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-150'
        >
          Explore dates
        </Button>
      </div>
    </>
  );
}
