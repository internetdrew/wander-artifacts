import StayExtensionHeader from '../shared/StayExtensionHeader';
import { useId } from 'react';
import { Button } from '@base-ui/react/button';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';

export default function ChooseNights({
  onBack,
  onNext,
  nights,
  direction,
  onChangeNights,
  currentCheckout,
  nightlyRate,
}: {
  onBack: () => void;
  onNext: () => void;
  nights: number;
  direction: number;
  onChangeNights: (nights: number) => void;
  currentCheckout: Date;
  nightlyRate: number;
}) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const choices = [1, 2, 3].map(extraNights => {
    const checkout = new Date(currentCheckout);
    checkout.setDate(checkout.getDate() + extraNights);
    return {
      nights: extraNights,
      weekday: checkout.toLocaleDateString(undefined, { weekday: 'short' }),
      date: checkout.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      fullDate: checkout.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  });
  const total = nightlyRate * nights;
  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <>
      <StayExtensionHeader
        id={`${id}-title`}
        title='Choose a new checkout date'
      />

      <fieldset
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-hint`}
        className='my-4 flex gap-2'
      >
        {choices.map(choice => (
          <label
            key={choice.nights}
            className='relative min-w-0 flex-1 cursor-pointer'
          >
            <input
              type='radio'
              name={`${id}-checkout`}
              value={choice.nights}
              checked={nights === choice.nights}
              onChange={() => onChangeNights(choice.nights)}
              aria-label={`${choice.fullDate}, ${choice.nights} extra ${choice.nights === 1 ? 'night' : 'nights'}`}
              className='peer sr-only'
            />
            <span className='relative flex flex-col items-center justify-center gap-0.5 rounded-xl border border-transparent bg-[#ECEFF0] p-1.5 text-[#202020] motion-safe:transition-colors motion-safe:duration-150 peer-checked:bg-[#D9DFE1] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 hover:bg-[#D9DFE1]'>
              <motion.span
                aria-hidden='true'
                className='pointer-events-none absolute -inset-px rounded-[inherit] border border-[#202020]/40'
                initial={false}
                animate={{ opacity: nights === choice.nights ? 1 : 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.15 }}
              />
              <motion.span
                aria-hidden='true'
                className='pointer-events-none absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-[#202020] text-white'
                initial={false}
                animate={{ opacity: nights === choice.nights ? 1 : 0 }}
                transition={{
                  duration: reducedMotion
                    ? 0
                    : nights === choice.nights
                      ? 0.12
                      : 0.15,
                  delay: !reducedMotion && nights === choice.nights ? 0.04 : 0,
                }}
              >
                <svg viewBox='0 0 16 16' fill='none' className='size-3'>
                  <path
                    d='m4 8 2.5 2.5L12 5'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </motion.span>
              <span className='text-xs font-[450] opacity-70'>
                {choice.weekday}
              </span>
              <span className='whitespace-nowrap font-[550]'>
                {choice.date}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className='h-[0.5px] bg-neutral-200 w-full my-4' />

      <div>
        <div className='flex items-center justify-between font-[450]'>
          <p className='text-[15px]'>Extension total</p>
          <NumberFlow
            value={total}
            animated={!reducedMotion}
            format={{
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }}
            className='tabular-nums font-[550]'
          />
        </div>
        <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] leading-5 font-[450] text-neutral-500'>
          <p className='flex flex-wrap items-center'>
            <span className='sr-only'>
              {currency.format(nightlyRate)} per night for {nights} extra{' '}
              {nights === 1 ? 'night' : 'nights'}.
            </span>
            <span aria-hidden='true' className='whitespace-pre'>
              {currency.format(nightlyRate)} ×{' '}
            </span>
            <AnimatedNights nights={nights} direction={direction} />
          </p>
          <p>Tax included</p>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-between gap-3 font-[450] text-sm'>
        <Button
          onClick={onBack}
          className='w-fit cursor-pointer rounded-full px-4 py-2 text-[#202020] hover:bg-[#ECEFF0] motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-2'
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className='w-fit cursor-pointer rounded-full bg-[#202020] px-4 py-2 text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2'
        >
          Review extension
        </Button>
      </div>
    </>
  );
}

function AnimatedNights({
  nights,
  direction,
}: {
  nights: number;
  direction: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <span aria-hidden='true' className='inline-flex items-center tabular-nums'>
      <span className='relative inline-block h-lh w-[1ch] overflow-hidden'>
        <AnimatePresence initial={false} custom={direction}>
          <motion.span
            key={nights}
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
      <span className='inline-flex h-lh items-center overflow-hidden whitespace-pre'>
        {' extra night'}
        <motion.span
          className='inline-block shrink-0 overflow-hidden'
          initial={false}
          animate={{
            width: nights > 1 ? 'auto' : 0,
            y: nights > 1 || reducedMotion ? 0 : 8,
            opacity: nights > 1 ? 1 : 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.2,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          s
        </motion.span>
      </span>
    </span>
  );
}
