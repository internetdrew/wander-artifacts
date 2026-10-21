import { useId, useLayoutEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import GetAcquaintedCard from './GetAcquaintedCard';
import SettleInCard from './SettleInCard';
import MakeItYoursCard from './MakeItYoursCard';
import WelcomeCard from './welcome-card/WelcomeCard';
import WifiCard from './wifi-card/WifiCard';
import WelcomeStackCard from './WelcomeStackCard';

const cards = [
  { id: 'welcome', title: 'Welcome to Watchmere', content: <WelcomeCard /> },
  {
    id: 'arrival',
    title: 'Getting acquainted',
    content: <GetAcquaintedCard />,
  },
  { id: 'wifi', title: 'Wi-Fi', content: <WifiCard /> },
  {
    id: 'settle-in',
    title: 'Make yourself at home',
    content: <SettleInCard />,
  },
  {
    id: 'make-it-yours',
    title: 'Make it yours',
    content: <MakeItYoursCard />,
  },
];

const PREVIEW_WIDTH = 112;
const HOVER_LIFT = 54;

function fanTransform(index: number, count: number, spacing: number) {
  const offset = index - (count - 1) / 2;
  const rotate = offset * (count > 1 ? Math.min(9, 46 / (count - 1)) : 0);
  return { rotate, x: offset * spacing, y: Math.abs(rotate) * 1.9 };
}

const WelcomeStack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bounds, setBounds] = useState({ width: 352, height: 0 });
  const list = useRef<HTMLUListElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const transferFocus = useRef(false);
  const reducedMotion = useReducedMotion();
  const id = useId();
  const previewScale = Math.min(0.36, PREVIEW_WIDTH / bounds.width);
  const previewHeight = bounds.height * previewScale;
  const fanPadding = Math.ceil(
    Math.max(0, previewHeight - 46) + HOVER_LIFT + 24,
  );
  const deckVisible = useInView(trigger);

  // The grid reserves one full-size playing card while previews are fixed.
  useLayoutEffect(() => {
    const node = list.current;
    if (!node) return;
    const measure = () =>
      setBounds({ width: node.clientWidth, height: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function selectCard(index: number) {
    if (index === currentIndex) return;
    list.current
      ?.querySelector('[data-stack-active="true"]')
      ?.querySelectorAll<HTMLMediaElement>('audio, video')
      .forEach(media => media.pause());
    transferFocus.current = true;
    setHoveredIndex(null);
    setCurrentIndex(index);
  }

  useLayoutEffect(() => {
    if (!transferFocus.current) return;
    transferFocus.current = false;
    list.current
      ?.querySelector<HTMLElement>(
        '[data-stack-active="true"] [data-card-content]',
      )
      ?.focus({ preventScroll: true });
  }, [currentIndex]);

  const hand = cards
    .map((_, index) => index)
    .filter(index => index !== currentIndex);
  const hoveredHandIndex =
    !deckVisible || hoveredIndex === null ? -1 : hand.indexOf(hoveredIndex);
  const previewWidth = bounds.width * previewScale;
  const maxOffset = (hand.length - 1) / 2;
  const spacing =
    maxOffset > 0
      ? Math.max(
          0,
          Math.min(58, (bounds.width / 2 - previewWidth * 0.8) / maxOffset),
        )
      : 0;

  return (
    <div
      className='relative mx-auto w-full max-w-88'
      role='region'
      aria-label='Stay essentials'
      data-deck-visible={deckVisible}
      style={{ paddingBottom: fanPadding }}
    >
      <p id={`${id}-instructions`} className='sr-only'>
        Choose a card from the fan at the bottom of the screen to open it in the
        center of this section.
      </p>
      <ul
        ref={list}
        className='relative isolate m-0 grid list-none p-0'
        aria-describedby={`${id}-instructions`}
      >
        {cards.map((card, index) => {
          const active = index === currentIndex;
          const handIndex = hand.indexOf(index);
          const fan = fanTransform(handIndex, hand.length, spacing);
          const hovered = deckVisible && index === hoveredIndex;
          const neighborShift =
            hoveredHandIndex !== -1 && !hovered
              ? (Math.sign(handIndex - hoveredHandIndex) * 16) /
                Math.max(1, Math.abs(handIndex - hoveredHandIndex))
              : 0;

          return (
            <WelcomeStackCard
              key={card.id}
              id={`${id}-${card.id}`}
              title={card.title}
              active={active}
              ownsSurface={card.id === 'wifi'}
              deckVisible={deckVisible}
              cardWidth={bounds.width}
              reducedMotion={!!reducedMotion}
              target={
                active
                  ? { x: 0, y: 0, rotate: 0, scale: 1 }
                  : {
                      x: fan.x + neighborShift,
                      y: deckVisible
                        ? hovered
                          ? -HOVER_LIFT
                          : fan.y
                        : previewHeight + 70,
                      rotate: hovered ? fan.rotate * 0.3 : fan.rotate,
                      scale: previewScale * (hovered ? 1.04 : 1),
                    }
              }
              zIndex={active ? 100 : 210 + handIndex}
              onSelect={() => selectCard(index)}
              onPreview={() => setHoveredIndex(index)}
              onClearPreview={() =>
                setHoveredIndex(current => (current === index ? null : current))
              }
            >
              {card.id === 'make-it-yours' ? <MakeItYoursCard active={active} /> : card.content}
            </WelcomeStackCard>
          );
        })}
      </ul>
      <div
        ref={trigger}
        aria-hidden='true'
        data-fan-trigger
        className='pointer-events-none absolute left-0 h-px w-full'
        style={{ top: bounds.height }}
      />
      <p role='status' aria-atomic='true' className='sr-only'>
        {cards[currentIndex].title} is open.
      </p>
    </div>
  );
};

export default WelcomeStack;
