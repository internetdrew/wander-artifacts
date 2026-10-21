import type { SVGProps } from 'react';

export function BlanketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='stroke-[#202020] size-5'
      {...props}
    >
      <rect x='4' y='3' width='16' height='4' rx='2' />
      <rect x='3' y='10' width='18' height='4' rx='2' />
      <rect x='2' y='17' width='20' height='4' rx='2' />
      <path d='M16 3v4' />
      <path d='M17 10v4' />
      <path d='M18 17v4' />
    </svg>
  );
}
