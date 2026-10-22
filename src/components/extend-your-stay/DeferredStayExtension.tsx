import { lazy, startTransition, Suspense, useState } from 'react';
import StayInvitation from './invitation/StayInvitation';

const loadExtension = () => import('./ExtendYourStay');
const ExtendYourStay = lazy(loadExtension);

export default function DeferredStayExtension() {
  const [exploring, setExploring] = useState(false);
  const invitation = (
    <section aria-label='Extend your stay'>
      <div
        className='relative tabular-nums mx-auto bg-white rounded-2xl overflow-visible'
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)' }}
        onPointerEnter={() => { void loadExtension().catch(() => {}); }}
        onFocus={() => { void loadExtension().catch(() => {}); }}
      >
        <div className='relative flow-root p-4 outline-none'>
          <div className='flow-root'>
            <StayInvitation
              checkoutLabel='Tomorrow'
              onNext={() => startTransition(() => setExploring(true))}
            />
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <Suspense fallback={invitation}>
      {exploring ? <ExtendYourStay exploreOnMount /> : invitation}
    </Suspense>
  );
}
