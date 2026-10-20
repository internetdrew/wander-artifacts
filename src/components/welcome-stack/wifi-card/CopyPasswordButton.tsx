import { Button } from '@base-ui/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export default function CopyPasswordButton({ password }: { password: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const reducedMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copyPassword() {
    if (pending.current) return;
    pending.current = true;
    setError('');
    try {
      await navigator.clipboard.writeText(password);
      if (!mounted.current) return;
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      if (mounted.current) {
        setError(
          'Could not copy the password. Please copy it from the details above.',
        );
      }
    } finally {
      pending.current = false;
    }
  }

  return (
    <>
      <Button
        type='button'
        onClick={copyPassword}
        aria-label={copied ? 'Password copied' : 'Copy password'}
        className='bg-[#202020] cursor-pointer mt-8 text-sm text-white w-full rounded-full py-2 focus-visible:outline-2 focus-visible:outline-offset-2'
      >
        <span className='inline-block' aria-hidden='true'>
          <AnimatePresence initial={false} mode='wait' custom={copied ? 1 : -1}>
            <motion.span
              key={copied ? 'copied' : 'copy'}
              custom={copied ? 1 : -1}
              className='inline-block'
              initial='enter'
              animate='visible'
              exit='exit'
              variants={{
                enter: (direction: number) => ({
                  y: reducedMotion ? 0 : direction * 4,
                  opacity: 0,
                  filter: reducedMotion ? 'blur(0px)' : 'blur(2px)',
                }),
                visible: { y: 0, opacity: 1, filter: 'blur(0px)' },
                exit: (direction: number) => ({
                  y: reducedMotion ? 0 : -direction * 4,
                  opacity: 0,
                  filter: reducedMotion ? 'blur(0px)' : 'blur(2px)',
                }),
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.15,
                ease: 'easeInOut',
              }}
            >
              {copied ? 'Copied' : 'Copy password'}
            </motion.span>
          </AnimatePresence>
        </span>
      </Button>
      <span role='status' className='sr-only'>
        {copied ? 'Wi-Fi password copied to clipboard.' : ''}
      </span>
      {error && (
        <p role='alert' className='mt-2 text-xs text-red-700'>
          {error}
        </p>
      )}
    </>
  );
}
