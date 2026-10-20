import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import WifiCardFront from './WifiCardFront';
import WifiCardBack from './WifiCardBack';

const WifiCard = () => {
  const [flipped, setFlipped] = useState(false);
  const reducedMotion = useReducedMotion();
  const surface = useRef<HTMLDivElement>(null);
  const frontButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const focusAfterFlip = useRef(false);
  const flip = () => {
    focusAfterFlip.current = true;
    setFlipped(previous => !previous);
  };
  const finishFlip = () => {
    if (!focusAfterFlip.current) return;
    focusAfterFlip.current = false;
    // Do not interrupt someone who moved to another part of the page.
    if (
      document.activeElement === document.body ||
      surface.current?.contains(document.activeElement)
    ) {
      (flipped ? backButton : frontButton).current?.focus({
        preventScroll: true,
      });
    }
  };
  return (
    <div ref={surface} className='md:max-w-88 font-[450] perspective-1000px'>
      <motion.div
        className='grid transform-3d'
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 140, damping: 22, mass: 0.8 }
        }
        onAnimationComplete={finishFlip}
      >
        <WifiCardFront hidden={flipped} onFlip={flip} buttonRef={frontButton} />
        <WifiCardBack hidden={!flipped} onFlip={flip} buttonRef={backButton} />
      </motion.div>
    </div>
  );
};

export default WifiCard;
