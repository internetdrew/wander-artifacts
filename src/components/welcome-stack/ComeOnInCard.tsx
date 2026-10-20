const ComeOnInCard = () => {
  return (
    <div
      className='bg-white md:max-w-88 rounded-2xl shadow-md font-[450] p-4 pt-3'
      style={{
        boxShadow:
          '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px -4px rgba(0,0,0,.06), 0 1px 3px 0 rgba(0,0,0,.04)',
      }}
    >
      <h3 className='font-[550] text-lg text-[#202020]'>
        Let's get you acquainted...
      </h3>

      {/* Two points */}
      <div className='mt-6 space-y-4'>
        {/* Parking */}
        <div className='flex items-start gap-2'>
          <div className='size-8 shrink-0 grid place-items-center bg-neutral-100 p-1 ring-[0.5px] ring-neutral-300/50 rounded-full'>
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
              className='stroke-[#202020] size-4'
            >
              <path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2' />
              <circle cx='7' cy='17' r='2' />
              <path d='M9 17h6' />
              <circle cx='17' cy='17' r='2' />
            </svg>
          </div>
          <div className='text-sm'>
            <p>Park beside the house</p>
            <p className='text-neutral-500'>
              Two spaces are yours. Please keep the driveway clear.
            </p>
          </div>
        </div>

        {/* Front door */}
        <div className='flex items-start gap-2'>
          <div className='size-8 shrink-0 grid place-items-center bg-neutral-100 p-1 ring-[0.5px] ring-neutral-300/50 rounded-full'>
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
              className='stroke-[#202020] size-4'
            >
              <path d='M10 21H2' />
              <path d='M10 3H7a2 2 0 00-2 2v16' />
              <path d='M14 12h.01' />
              <path d='M19 21V5a2 2 0 00-1.675-1.974l-6.163-1.013A1 1 0 0010 3v18a1 1 0 001.124.992z' />
              <path d='M22 21h-3' />
            </svg>
          </div>
          <div className='text-sm'>
            <p>Follow the lit path</p>
            <p className='text-neutral-500'>
              Two spaces are yours. Please keep the driveway clear.
            </p>
          </div>
        </div>
      </div>

      {/* Getting Inside */}
      <div className='p-3 pt-2 bg-neutral-100 rounded-lg mt-4 font-[450]'>
        <p className='text-sm'>Getting inside</p>
        <ol className='mt-2 space-y-1 text-pretty list-decimal list-inside text-neutral-500 text-xs'>
          <li>
            Enter your guest code, then press{' '}
            <span className='ring-[0.5px] mx-1 ring-neutral-400 px-2 py-0.5 rounded-sm inline-flex items-center align-middle'>
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
                className='size-3'
              >
                <path d='M20 6 9 17l-5-5' />
              </svg>
            </span>
            .
          </li>
          <li>Wait for the lock to release, then open the door.</li>
        </ol>
        <div className='h-px w-full bg-neutral-200 mt-3 mb-2' />
        <div className='flex items-center justify-between'>
          <span className='text-xs font-neutral-500'>Entry code</span>
          <span className='font-[550] tracking-widest text-lg'>2436</span>
        </div>
      </div>

      <div className='h-px bg-neutral-200 my-4'></div>

      <div className='flex items-start gap-2'>
        <div className='size-8 shrink-0 grid place-items-center bg-neutral-100 p-1 ring-[0.5px] ring-neutral-300/50 rounded-full'>
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
            className='size-4 stroke-[#202020]'
          >
            <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
            <path d='M7 11V7a5 5 0 0 1 10 0v4' />
          </svg>
        </div>
        <div className='text-sm'>
          <p>Heading out?</p>
          <p className='text-neutral-500 leading-tight text-pretty'>
            Close the door and press the keypad's lock button. Check that it's
            locked before you go.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComeOnInCard;
