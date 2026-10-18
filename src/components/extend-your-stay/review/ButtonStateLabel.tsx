import { AnimatePresence, motion } from 'motion/react';

import { BUTTON_LAYOUT } from './buttonMotion';

export default function ButtonStateLabel({ label, reducedMotion }: { label: string; reducedMotion: boolean }) {
  return (
    <AnimatePresence initial={false} mode='popLayout'>
      <motion.span
        key={label}
        layout={reducedMotion ? false : 'position'}
        className='inline-block whitespace-nowrap'
        initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -4, transition: { duration: 0.1 } }}
        transition={{
          layout: BUTTON_LAYOUT,
          duration: 0.15,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}
