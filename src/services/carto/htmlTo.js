import { html2pdf, html2canvas } from './html2pdf';

const formats = {
  PDF: 'pdf',
  PNG: 'png',
};

const A2 = [594, 420]; // A2 in mm;
const A2px = A2.map((mm) => mm * 3.779528);

const blobToURL = (blob) => {
  return URL.createObjectURL(blob);
};

const htmlToPDF = (html, opts) => {
  return new Promise((resolve, reject) => {
    const toBlob = (pdf) => {
      return pdf.output('blob');
    };
    const defaultOpts = {
      orientation: 'landscape',
      unit: 'mm',
      format: A2,
    };
    const options = Object.assign({}, defaultOpts, opts);

    html2pdf(html, options)
      .then(toBlob)
      .then(blobToURL)
      .then(resolve)
      .catch(reject);
  });
};

const htmlToPNG = (html) => {
  const toBlob = (canvas) => {
    return canvas.toBlob();
  };

  return new Promise((resolve, reject) => {
    const promise = html2canvas(html, {
      width: A2px[0],
      height: A2px[1],
    });

    promise.then(toBlob)
      .then(blobToURL)
      .then(resolve)
      .catch(reject);
  });
};

const htmlTo = (html, format) => {
  return new Promise((resolve, reject) => {
    let promise = null;
    switch (format) {
      case formats.PDF:
        promise = htmlToPDF(html);
        break;
      case formats.PNG:
        promise = htmlToPNG(html);
        break;
      default:
        promise = htmlToPDF(html);
        break;
    }
    promise.then(resolve).catch(reject);
  });
};

export default htmlTo;
