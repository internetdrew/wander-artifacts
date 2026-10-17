import { useEffect } from 'react';
import { useMotionValue } from 'motion/react';
import TextSwap from '../../TextSwap';

export default function StayExtensionHeader({ title, id, announce = false }: {
  title: string;
  id?: string;
  announce?: boolean;
}) {
  const displayedTitle = useMotionValue(title);

  useEffect(() => {
    displayedTitle.set(title);
  }, [title, displayedTitle]);

  return (
    <h3 id={id} className='text-lg font-[550]' aria-live={announce ? 'polite' : undefined} aria-atomic={announce || undefined}>
      <span className='sr-only'>{title}</span>
      <span aria-hidden='true'>
        <TextSwap value={displayedTitle} />
      </span>
    </h3>
  );
}
