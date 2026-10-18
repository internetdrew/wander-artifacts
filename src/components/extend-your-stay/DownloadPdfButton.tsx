import { useRef } from 'react';
import { Button } from '@base-ui/react/button';

export default function DownloadPdfButton({
  onDownload,
}: {
  onDownload: () => Promise<void>;
}) {
  const downloading = useRef(false);

  async function download() {
    if (downloading.current) return;
    downloading.current = true;
    try {
      await onDownload();
    } finally {
      downloading.current = false;
    }
  }

  return (
    <Button
      onClick={download}
      className='pointer-events-auto flex min-w-40 cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-[550] text-[#202020] shadow-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2'
    >
      Download PDF
    </Button>
  );
}
