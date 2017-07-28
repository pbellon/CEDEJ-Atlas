/**
* html2pdf.js
* Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
*
* Licensed under the MIT License.
* http://opensource.org/licenses/mit-license
*/
import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

const html2pdf = (html, options) => {
  const pdf = jsPDF(options);

  return new Promise((resolve, reject) => {
    try {
      let body;
      let doc;
      const iframe = document.createElement('iframe');
      const canvas = pdf.canvas;
      if (!canvas) {
        throw new Error('jsPDF canvas plugin not installed');
      }

      document.body.appendChild(iframe);
      doc = iframe.contentDocument;
      if (doc === undefined || doc === null) {
        doc = iframe.contentWindow.document;
      }

      canvas.pdf = pdf;
      pdf.annotations = {
        _nameMap: [],
        createAnnotation: (href, bounds) => {
          const x = pdf.context2d._wrapX(bounds.left);
          const y = pdf.context2d._wrapY(bounds.top);
          // const page = pdf.context2d._page(bounds.top);
          const index = href.indexOf('#');
          let options;
          if (index >= 0) {
            options = {
              name: href.substring(index + 1),
            };
          } else {
            options = {
              url: href,
            };
          }
          pdf.link(x, y, bounds.right - bounds.left, bounds.bottom - bounds.top, options);
        },

        setName: (name, bounds) => {
          const x = pdf.context2d._wrapX(bounds.left);
          const y = pdf.context2d._wrapY(bounds.top);
          const page = pdf.context2d._page(bounds.top);
          this._nameMap[name] = { page, x, y };
        },
      };

      canvas.annotations = pdf.annotations;

      pdf.context2d._pageBreakAt = (y) => {
        this.pageBreaks.push(y);
      };

      pdf.context2d._gotoPage = (pageOneBased) => {
        while (pdf.internal.getNumberOfPages() < pageOneBased) {
          pdf.addPage();
        }
        pdf.setPage(pageOneBased);
      };

      if (typeof html === 'string') {
        // remove all scripts
        const p = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        doc.open();
        doc.write(html.replace(p, ''));
        doc.close();
        body = doc.body;
      } else {
        body = html;
      }

      html2canvas(body, {
        canvas,
        onrendered: () => {
          if (iframe) {
            iframe.parentElement.removeChild(iframe);
          }
          resolve(pdf);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};
export { html2pdf, html2canvas };
export default html2pdf;
