import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@base-ui/react/button';
import ButtonStateLabel from './ButtonStateLabel';
import { BUTTON_LAYOUT } from './buttonMotion';
import { PROCESSING_MS, type PaymentStatus } from './paymentTiming';

export default function ReviewActions({ status, label, onBack, onNext, onPay }: {
  status: PaymentStatus;
  label: string;
  onBack: () => void;
  onNext: () => void;
  onPay: () => void;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <div className='mt-8 flex items-center justify-between text-sm font-[550] gap-4'>
      {status !== 'paid' && (
        <Button
          onClick={onBack}
          disabled={status === 'processing'}
          className='px-4 py-2.5 w-fit rounded-full enabled:hover:bg-[#ECEFF0] enabled:cursor-pointer disabled:cursor-default disabled:text-neutral-400 motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-2'
        >
          Back
        </Button>
      )}
      <Button
        render={
          <motion.button
            layout={!reducedMotion}
            transition={{ layout: BUTTON_LAYOUT }}
            style={{ borderRadius: 9999 }}
          />
        }
        onClick={() =>
          status === 'paid' ? onNext() : onPay()
        }
        disabled={status === 'processing'}
        aria-busy={status === 'processing'}
        aria-label={label}
        className={`group relative inline-flex px-4 py-2.5 w-fit ml-auto items-center justify-center overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-colors motion-safe:duration-150 ${status === 'processing' ? 'cursor-wait bg-[#d7e5db] text-[#2e6b44]' : status === 'paid' ? 'cursor-pointer bg-[#202020] text-white enabled:hover:bg-black' : 'cursor-pointer bg-[#00733D] text-white enabled:hover:bg-[#005A2E]'}`}
      >
        <ButtonStateLabel label={label} reducedMotion={!!reducedMotion} />
        <motion.span
          aria-hidden='true'
          className={`pointer-events-none absolute inset-0 grid place-items-center text-white ${status === 'paid' ? 'bg-[#202020] group-hover:bg-black' : 'bg-[#2e6b44]'}`}
          initial={false}
          animate={{
            clipPath:
              status === 'idle' || reducedMotion
                ? 'inset(0 100% 0 0)'
                : 'inset(0 0% 0 0)',
          }}
          transition={{
            duration:
              status === 'processing' && !reducedMotion
                ? PROCESSING_MS / 1000
                : 0,
            ease: 'linear',
          }}
        >
          <ButtonStateLabel label={label} reducedMotion={!!reducedMotion} />
        </motion.span>
      </Button>
    </div>
  );
}
