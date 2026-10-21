import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { createInvoicePdf } from './invoicePdf';
import InvoiceContent from './InvoiceContent';
import DownloadPdfButton from './DownloadPdfButton';

export default function StayInvoice({
  checkout,
  nights,
  nightlyRate,
  layoutId,
}: {
  layoutId: string;
  checkout: Date;
  nights: number;
  nightlyRate: number;
}) {
  const reducedMotion = useReducedMotion();
  const [unfolded, setUnfolded] = useState(false);
  const [unfoldComplete, setUnfoldComplete] = useState(false);
  const [issuedAt] = useState(() => new Date());
  const [downloadError, setDownloadError] = useState('');
  const invoiceContent = useRef<HTMLDivElement>(null);
  const issued = issuedAt.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const date = checkout.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const nightsLabel = `${nights} extra ${nights === 1 ? 'night' : 'nights'} confirmed`;
  const paid = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(nightlyRate * nights);
  async function downloadPdf() {
    if (!invoiceContent.current) return;
    setDownloadError('');
    try {
      const pdf = await createInvoicePdf(invoiceContent.current);
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `watchmere-invoice-${checkout.getFullYear()}-${String(checkout.getMonth() + 1).padStart(2, '0')}-${String(checkout.getDate()).padStart(2, '0')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadError('');
    } catch {
      setDownloadError('Could not download the invoice. Please try again.');
    }
  }
  return (
    <>
      <article
        aria-label='Stay extension invoice'
        className='invoice-stage pointer-events-auto mt-0'
      >
        <div className='sr-only'>
          <InvoiceContent
            date={date}
            issued={issued}
            nightsLabel={nightsLabel}
            paid={paid}
          />
        </div>
        <motion.div
          aria-hidden='true'
          layoutId={reducedMotion ? undefined : layoutId}
          className='invoice-folded-footprint'
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          onLayoutAnimationComplete={() => setUnfolded(true)}
          style={{ borderRadius: 2 }}
        >
          <div className='invoice-paper'>
            {[0, 1, 2].map(panel => {
              // The top flap sits on top of the folded stack and opens first.
              const delay = panel === 0 ? 0.02 : 0.25;
              const folded = panel === 0 ? -180 : panel === 2 ? 180 : 0;
              return (
                <motion.div
                  key={panel}
                  className={`invoice-panel invoice-panel-${panel}`}
                  initial={{ rotateX: reducedMotion ? 0 : folded }}
                  animate={{ rotateX: unfolded || reducedMotion ? 0 : folded }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.22,
                    delay: reducedMotion ? 0 : delay,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                  onAnimationComplete={() => {
                    if (panel === 2 && unfolded) setUnfoldComplete(true);
                  }}
                >
                  <div className='invoice-face invoice-front'>
                    <div
                      className='invoice-slice'
                      style={{ top: `${-panel * 100}%` }}
                    >
                      <InvoiceContent
                        ref={panel === 1 ? invoiceContent : undefined}
                        animateLogo={unfoldComplete}
                        date={date}
                        issued={issued}
                        nightsLabel={nightsLabel}
                        paid={paid}
                      />
                    </div>
                    <motion.div
                      className={`invoice-shade invoice-shade-${panel}`}
                      initial={{
                        opacity: reducedMotion || panel === 1 ? 0 : 0.18,
                      }}
                      animate={{
                        opacity: unfolded
                          ? 0
                          : reducedMotion || panel === 1
                            ? 0
                            : 0.18,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.22,
                        delay: reducedMotion ? 0 : delay,
                      }}
                    />
                  </div>
                  <div className='invoice-face invoice-back' />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </article>
      <div className='mt-5 flex h-10 justify-center w-fit mx-auto'>
        {(unfoldComplete || reducedMotion) && (
          <motion.div
            className='flex'
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'easeOut' }}
          >
            <DownloadPdfButton onDownload={downloadPdf} />
          </motion.div>
        )}
      </div>
      {downloadError && (
        <p role='alert' className='mt-2 text-center text-sm text-red-700'>
          {downloadError}
        </p>
      )}
    </>
  );
}
