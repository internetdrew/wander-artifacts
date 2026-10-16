import { type ComponentProps } from 'react';
import { Button } from '@base-ui/react/button';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';

export default function ChooseNights({
  onBack,
  onNext,
  nights,
  direction,
  onChangeNights,
  checkoutLabel,
  nightlyRate,
}: {
  onBack: () => void;
  onNext: () => void;
  nights: number;
  direction: number;
  onChangeNights: (delta: number) => void;
  checkoutLabel: string;
  nightlyRate: number;
}) {
  return (
    <>
      <p className='font-[550] text-lg'>Stay a little longer</p>
      <p className='text-sm font-[450] mt-0.5 text-neutral-500'>
        Checkout on {checkoutLabel} at 11 AM.
      </p>
      <div className='my-8'>
        <NightsStepper
          nights={nights}
          direction={direction}
          onChange={onChangeNights}
        />
      </div>

      <div className='flex items-baseline justify-between'>
        <span className='inline-flex items-center gap-1 text-sm font-[450]'>
          {nightlyRate.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
          <span>×</span>
          <AnimatedNights nights={nights} direction={direction} />
        </span>
        <NumberFlow
          value={nightlyRate * nights}
          format={{
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }}
          className='tabular-nums font-[450]'
        />
      </div>
      <p className='text-xs text-neutral-500 font-[450] -mt-1'>
        Additional charge. Taxes included.
      </p>

      <div className='mt-8 space-y-2'>
        <Button
          onClick={onNext}
          className='h-11 w-full cursor-pointer rounded-full bg-[#202020] text-white hover:bg-[#202020]/95 font-[450] focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-150'
        >
          Review stay extension
        </Button>
        <Button
          onClick={onBack}
          className='h-11 w-full rounded-full cursor-pointer text-[#202020] hover:text-[#202020]/95 font-[450] focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-colors motion-safe:duration-150'
        >
          Back
        </Button>
      </div>
    </>
  );
}

function NightsStepper({
  nights,
  direction,
  onChange,
}: {
  nights: number;
  direction: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div
      role='group'
      aria-label='Extra nights'
      className='flex w-full items-center justify-between'
    >
      <Button
        aria-label='Remove one night'
        disabled={nights <= 1}
        onClick={() => onChange(-1)}
        className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-white bg-[#202020] enabled:hover:bg-[#202020]/95 disabled:cursor-default disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2'
      >
        <MinusIcon />
      </Button>
      <span className='flex h-11 min-w-24 flex-1 items-center justify-center gap-1 tabular-nums'>
        <AnimatedNights nights={nights} direction={direction} extra announce />
      </span>
      <Button
        aria-label='Add one night'
        disabled={nights >= 3}
        onClick={() => onChange(1)}
        className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-white bg-[#202020] enabled:hover:bg-[#202020]/95 disabled:cursor-default disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2'
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

function AnimatedNights({
  nights,
  direction,
  announce = false,
  extra = false,
}: {
  nights: number;
  direction: number;
  announce?: boolean;
  extra?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const label = `${nights} ${extra ? 'extra ' : ''}${nights === 1 ? 'night' : 'nights'}`;
  return (
    <span className='inline-flex items-center gap-1 font-[450] tabular-nums'>
      <span
        className='sr-only'
        aria-live={announce ? 'polite' : undefined}
        aria-atomic='true'
      >
        {label}
      </span>
      <span className='relative h-8 w-[1ch] overflow-hidden' aria-hidden='true'>
        <AnimatePresence initial={false} custom={direction}>
          <motion.span
            key={nights}
            aria-hidden='true'
            custom={direction}
            className='absolute inset-0 grid place-items-center'
            variants={{
              enter: (dir: number) => ({
                y: reducedMotion ? 0 : -dir * 12,
                opacity: 0,
              }),
              visible: { y: 0, opacity: 1 },
              exit: (dir: number) => ({
                y: reducedMotion ? 0 : dir * 12,
                opacity: 0,
              }),
            }}
            initial='enter'
            animate='visible'
            exit='exit'
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    y: { type: 'spring', visualDuration: 0.2, bounce: 0.2 },
                    opacity: { duration: 0.15 },
                  }
            }
          >
            {nights}
          </motion.span>
        </AnimatePresence>
      </span>
      {extra && <span aria-hidden='true'>more</span>}
      <span
        aria-hidden='true'
        className='inline-flex h-8 items-center overflow-hidden'
      >
        night
        <motion.span
          initial={false}
          animate={{
            transform:
              nights > 1 || reducedMotion
                ? 'translateY(0px)'
                : 'translateY(8px)',
            opacity: nights > 1 ? 1 : 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : nights > 1 ? 0.15 : 0.12,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          s
        </motion.span>
      </span>
    </span>
  );
}

function PlusIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      stroke='currentColor'
      strokeLinecap='square'
      strokeLinejoin='round'
      {...props}
      style={{ display: 'block', ...props.style }}
    >
      <path d='M1.5 8h13M8 14.5v-13' />
    </svg>
  );
}

function MinusIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      stroke='currentColor'
      strokeLinecap='square'
      strokeLinejoin='round'
      {...props}
      style={{ display: 'block', ...props.style }}
    >
      <path d='M1.5 8h13' />
    </svg>
  );
}
