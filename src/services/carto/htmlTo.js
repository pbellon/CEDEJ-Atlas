import { html2pdf, html2canvas } from './html2pdf2';
import formats from 'utils/formats';

const A4 = [297,210];
const A4px = A4.map((mm) => mm * 3.779528);

const A2 = [594, 420]; // A2 in mm;
const A2px = A2.map((mm) => mm * 3.779528);

const blobToURL = (blob) => {
  return URL.createObjectURL(blob);
};

const htmlToPDF = (html, opts={}) => {
  const toBlob = (pdf) => {
    return pdf.output('blob');
  };
  const jsPDFOpts = {
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  };
  const options = {
    ...opts,
    jsPDF: jsPDFOpts,
  };

  return html2pdf(html, options)
    .then(toBlob)
    .then(blobToURL);
};

const htmlToPNG = (html) => {
  const toBlob = (canvas) => {
    return new Promise((resolve, reject)=>{
      try {
        canvas.toBlob(resolve);
      } catch (e) {
        reject(e)
      }
    });
  };

  return new Promise((resolve, reject) => {
    const promise = html2canvas(html, {
      width: A4px[0],
      height: A4px[1],
    });

    promise.then(toBlob)
      .then(blobToURL)
      .then(resolve)
      .catch(reject);
  });
};

const htmlTo = (html, format) => {
  console.log('htmlTo', html, format); 
  switch (format) {
    case formats.PDF:
      return htmlToPDF(html);
    case formats.PNG:
      return htmlToPNG(html);
    default:
      return htmlToPDF(html);
  }
};

export default htmlTo;
