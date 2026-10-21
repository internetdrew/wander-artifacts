import { useState } from 'react';
import CoffeeMachine from './coffee-machine/CoffeeMachine';
import Fireplace from './fireplace/Fireplace';
import HotTub from './hot-tub/HotTub';
import { Tabs } from '@base-ui/react/tabs';
import './amenity-tabs.css';

const amenities = [
  {
    id: 'coffee',
    label: 'Coffee',
    icon: (
      <>
        <path d='M18 8h1a3 3 0 1 1 0 6h-1' />
        <path d='M3 8h15v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z' />
        <path d='M6 2v2M10 2v2M14 2v2' />
      </>
    ),
    title: 'Coffee & filters',
    description: 'In the cupboard above the machine.',
  },
  {
    id: 'fireplace',
    label: 'Fireplace',
    icon: (
      <path d='M12 3c1 5-3 6-3 9-1-1-2-2-2-4-3 3-4 5-4 7a9 9 0 0 0 18 0c0-5-4-9-9-12Z' />
    ),
    title: 'A cozy evening',
    description:
      'Check the fireplace instructions before lighting your first fire.',
  },
  {
    id: 'hot-tub',
    label: 'Hot tub',
    icon: (
      <>
        <path d='M6 3c-4 4 4 4 0 8M12 3c-4 4 4 4 0 8M18 3c-4 4 4 4 0 8' />
        <path d='M3 14h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z' />
      </>
    ),
    title: 'Time to unwind',
    description:
      'Check the hot tub instructions before your first soak, and replace the cover afterward.',
  },
];

function AmenityIcon({
  amenity,
  className,
}: {
  amenity: (typeof amenities)[number];
  className: string;
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden='true'
    >
      {amenity.icon}
    </svg>
  );
}

export default function MakeItYoursCard({
  active = false,
}: {
  active?: boolean;
}) {
  const [selectedAmenity, setSelectedAmenity] = useState('coffee');

  return (
    <div className='flex h-full min-h-full flex-col rounded-2xl bg-white p-4 pt-3 pb-6 font-[450] md:max-w-88'>
      <h3 className='text-lg font-[550] text-[#202020]'>
        Slow mornings. Cozy nights.
      </h3>

      <Tabs.Root
        value={selectedAmenity}
        onValueChange={value => setSelectedAmenity(String(value))}
        className='mt-4 flex min-h-0 flex-1 flex-col'
      >
        <Tabs.List
          aria-label='Home amenities'
          className='relative isolate flex shrink-0 gap-0.5 rounded-lg bg-[#ECEFF0] p-1'
        >
          {amenities.map(amenity => (
            <Tabs.Tab
              key={amenity.id}
              value={amenity.id}
              className='relative z-1 flex min-h-9 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 text-xs text-neutral-500 before:absolute before:-inset-y-1 before:inset-x-0 outline-offset-2 data-active:text-[#202020] focus-visible:outline-2 focus-visible:outline-[#202020]'
            >
              <AmenityIcon amenity={amenity} className='size-3.5 shrink-0' />
              {amenity.label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className='amenity-indicator' />
        </Tabs.List>

        <div className='relative mt-4 grid min-h-0 flex-1 grid-cols-1'>
          {amenities.map(amenity => (
            <Tabs.Panel
              key={amenity.id}
              value={amenity.id}
              className='amenity-panel col-start-1 row-start-1 flex min-h-0 flex-col rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#202020]'
            >
              <div className='relative mb-4 min-h-0 flex-1'>
                {amenity.id === 'coffee' ? (
                  <CoffeeMachine
                    active={active && selectedAmenity === 'coffee'}
                  />
                ) : amenity.id === 'fireplace' ? (
                  <Fireplace
                    active={active && selectedAmenity === 'fireplace'}
                  />
                ) : (
                  <HotTub active={active && selectedAmenity === 'hot-tub'} />
                )}
              </div>

              <div className='mt-auto flex shrink-0 items-start gap-4'>
                <div className='mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[#ECEFF0] p-1 ring-[0.5px] ring-neutral-300/50'>
                  <AmenityIcon
                    amenity={amenity}
                    className='size-5 text-[#202020]'
                  />
                </div>
                <div className='text-[13px] leading-4.75'>
                  <p className='text-[#202020]'>{amenity.title}</p>
                  <p className='text-pretty text-neutral-500'>
                    {amenity.description}
                  </p>
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </div>
      </Tabs.Root>
    </div>
  );
}
