import { useEffect, type Ref } from 'react';
import { useMotionValue } from 'motion/react';
import TextSwap from '../../shared/TextSwap';

export default function StayExtensionHeader({
  title,
  id,
  announce = false,
  ref,
  tabIndex,
}: {
  title: string;
  id?: string;
  announce?: boolean;
  ref?: Ref<HTMLHeadingElement>;
  tabIndex?: number;
}) {
  const displayedTitle = useMotionValue(title);

  useEffect(() => {
    displayedTitle.set(title);
  }, [title, displayedTitle]);

  return (
    <h3
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      className='text font-[450]'
      aria-live={announce ? 'polite' : undefined}
      aria-atomic={announce || undefined}
    >
      <span className='sr-only'>{title}</span>
      <span aria-hidden='true'>
        <TextSwap value={displayedTitle} />
      </span>
    </h3>
  );
}
