import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PAID_TIMING, type PaymentStatus } from './paymentTiming';

export default function PaymentDetails({ status }: { status: PaymentStatus }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className='grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1'>
      <dt className='contents'>
        <span
          aria-hidden='true'
          className='col-start-1 row-start-1 row-span-2 grid size-10 place-items-center rounded-lg bg-[#D9DFE1] p-2.5 text-[#202020]'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-full'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect width='20' height='14' x='2' y='5' rx='2' />
            <line x1='2' x2='22' y1='10' y2='10' />
            <path d='M6 14h2' />
          </svg>
        </span>
        <motion.span
          initial={false}
          layout='position'
          layoutDependency={status}
          transition={{
            duration: reducedMotion ? 0 : PAID_TIMING.charge,
          }}
          className='col-start-2 row-start-1 flex items-baseline text-neutral-500'
        >
          Charg
          <AnimatePresence initial={false}>
            <motion.span
              key={status}
              initial={{
                opacity: 0,
                width: 0,
                y: reducedMotion ? 0 : 4,
              }}
              animate={{ opacity: 1, width: 'auto', y: 0 }}
              exit={{ opacity: 0, width: 0, y: reducedMotion ? 0 : -4 }}
              className='inline-block overflow-hidden'
              transition={{
                duration: reducedMotion ? 0 : PAID_TIMING.charge,
                ease: [0.215, 0.61, 0.355, 1],
              }}
            >
              {status === 'processing'
                ? 'ing'
                : status === 'paid'
                  ? 'ed'
                  : 'e'}
            </motion.span>
          </AnimatePresence>
          <span className='whitespace-pre'> to</span>
        </motion.span>
      </dt>
      <dd className='col-start-2 row-start-2 flex items-center font-[450]'>
        <motion.span
          className='grid h-3.5 shrink-0 place-items-center overflow-hidden'
          aria-hidden='true'
          initial={false}
          animate={{
            width: status === 'idle' ? 0 : '0.875rem',
            marginRight: status === 'idle' ? 0 : '0.5rem',
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.2,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          <AnimatePresence initial={false}>
            {status === 'processing' && (
              <motion.span
                key='spinner'
                className='col-start-1 row-start-1'
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.12,
                  ease: 'easeOut',
                }}
              >
                <motion.span
                  className='block size-3.5 rounded-full border-2 border-[#3d8941]/20 border-t-[#3d8941]'
                  animate={{
                    transform: reducedMotion
                      ? 'rotate(0deg)'
                      : 'rotate(360deg)',
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.75,
                    repeat: reducedMotion ? 0 : Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.span>
            )}
            {status === 'paid' && (
              <motion.svg
                key='paid'
                viewBox='0 0 16 16'
                className='col-start-1 row-start-1 size-3.5'
                initial={{ opacity: reducedMotion ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.15 }}
              >
                <circle cx='8' cy='8' r='8' className='fill-[#3d8941]' />
                <motion.path
                  d='M4.2 8.2 6.7 10.7 11.8 5.4'
                  fill='none'
                  stroke='white'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  initial={{ pathLength: reducedMotion ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.2,
                    delay: reducedMotion ? 0 : 0.04,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.span>
        Visa ending 4242
      </dd>
    </div>
  );
}
