import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const WelcomeStack = lazy(() => import('./WelcomeStack'));

function StackPlaceholder() {
  // Match the card's 5:7 ratio and the fan padding, including narrow screens.
  return (
    <div className='@container mx-auto w-full max-w-88' aria-hidden='true'>
      <div style={{ paddingBottom: 'clamp(78px, calc(50.4cqw + 32px), 188.8px)' }}>
        <div className='aspect-5/7' />
      </div>
    </div>
  );
}

export default function DeferredWelcomeStack() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const node = host.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: '400px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host}>
      {ready ? (
        <Suspense fallback={<StackPlaceholder />}>
          <WelcomeStack />
        </Suspense>
      ) : <StackPlaceholder />}
    </div>
  );
}
