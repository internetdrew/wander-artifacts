import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface WelcomeStackCardProps {
  id: string;
  title: string;
  active: boolean;
  ownsSurface?: boolean;
  deckVisible: boolean;
  cardWidth: number;
  reducedMotion: boolean;
  target: { x: number; y: number; rotate: number; scale: number };
  zIndex: number;
  onSelect: () => void;
  onPreview: () => void;
  onClearPreview: () => void;
  children: ReactNode;
}

const CARD_SPRING = {
  type: 'spring',
  stiffness: 340,
  damping: 36,
  mass: 0.9,
} as const;

export default function WelcomeStackCard({
  id,
  title,
  active,
  ownsSurface = false,
  deckVisible,
  cardWidth,
  reducedMotion,
  target,
  zIndex,
  onSelect,
  onPreview,
  onClearPreview,
  children,
}: WelcomeStackCardProps) {
  return (
    <li
      className='pointer-events-none relative col-start-1 row-start-1 aspect-5/7 min-w-0'
      data-stack-active={active}
      style={{ zIndex }}
    >
      <motion.div
        className={
          `${active ? 'absolute top-0 left-0' : 'fixed left-1/2'}${ownsSurface ? '' : ' bg-white'}`
        }
        data-card-surface
        aria-hidden={!active && !deckVisible}
        inert={!active && !deckVisible}
        layout='position'
        layoutDependency={`${active}:${cardWidth}`}
        style={{
          width: cardWidth,
          aspectRatio: '5 / 7',
          marginLeft: active ? 0 : -cardWidth / 2,
          bottom: active ? undefined : -46,
          originX: 0.5,
          originY: 1,
          pointerEvents: active || deckVisible ? 'auto' : 'none',
          borderRadius: 16,
          boxShadow: ownsSurface ? 'none' :
            '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)',
        }}
        initial={false}
        animate={target}
        transition={reducedMotion ? { duration: 0 } : CARD_SPRING}
      >
        <div
          id={`${id}-content`}
          data-card-content
          role='group'
          aria-label={title}
          aria-hidden={!active}
          inert={!active}
          tabIndex={-1}
          className={`h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4${ownsSurface ? '' : ' overflow-x-hidden overflow-y-auto'}`}
        >
          {children}
        </div>
        {!active && (
          <button
            type='button'
            className='absolute inset-0 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4'
            aria-label={`Open ${title} card`}
            aria-controls={`${id}-content`}
            title={title}
            onClick={onSelect}
            onFocus={onPreview}
            onBlur={onClearPreview}
            onPointerEnter={event => {
              if (event.pointerType === 'mouse') onPreview();
            }}
            onPointerLeave={onClearPreview}
          />
        )}
      </motion.div>
    </li>
  );
}
