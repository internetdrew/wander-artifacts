import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, type MotionValue } from 'motion/react';

export default function TextSwap({ value, className = '' }: { value: MotionValue<string>; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [initialLabel] = useState(() => value.get());
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let latest = value.get();
    let busy = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const duration = getComputedStyle(el)
      .getPropertyValue('--text-swap-dur')
      .trim();
    const parsed = Number.parseFloat(duration);
    const durationMs = Number.isFinite(parsed)
      ? parsed * (duration.endsWith('ms') ? 1 : 1000)
      : 150;

    function swap() {
      if (!el) return;
      if (reducedMotion) {
        el.textContent = latest;
        return;
      }
      if (busy || el.textContent === latest) return;
      busy = true;
      el.classList.add('is-exit');
      timer = setTimeout(() => {
        // Read the latest requested label, skipping stale intermediate states.
        el.textContent = latest;
        el.classList.remove('is-exit');
        el.classList.add('is-enter-start');
        void el.offsetWidth;
        el.classList.remove('is-enter-start');
        timer = setTimeout(() => {
          busy = false;
          swap();
        }, durationMs);
      }, durationMs);
    }

    el.classList.remove('is-exit', 'is-enter-start');
    el.textContent = latest;
    const unsubscribe = value.on('change', next => {
      latest = next;
      swap();
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
      el.classList.remove('is-exit', 'is-enter-start');
    };
  }, [value, reducedMotion]);

  return (
    <span ref={ref} className={`t-text-swap ${className}`}>
      {initialLabel}
    </span>
  );
}

