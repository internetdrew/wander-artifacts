/** Export the same rendered InvoiceContent used by the folding panels.
 * Capture only the paper, at 3x resolution, after its fonts have loaded.
 * This keeps locale, copy, CSS, and branding in one place.
 */
export async function createInvoicePdf(content: HTMLElement): Promise<Blob> {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([
    import('html-to-image'),
    import('jspdf'),
  ]);
  await document.fonts.ready;

  // The dialog scales the paper to fit. Export at its unscaled dimensions,
  // outside the parent's clipped fold slice, without changing the live DOM.
  const width = content.offsetWidth;
  const height = content.offsetHeight;
  const canvas = await toCanvas(content, {
    width,
    height,
    pixelRatio: 3,
    style: { transform: 'none', width: `${width}px`, height: `${height}px` },
  });
  const pdf = new jsPDF({
    unit: 'px',
    format: [width, height],
    orientation: width > height ? 'landscape' : 'portrait',
    hotfixes: ['px_scaling'],
    compress: true,
  });
  pdf.setProperties({ title: 'Stay extension invoice', creator: 'Watchmere' });
  pdf.addImage(canvas, 'PNG', 0, 0, width, height);
  return pdf.output('blob');
}
