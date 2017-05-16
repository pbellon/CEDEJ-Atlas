/**
* html2pdf.js
* Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
*
* Licensed under the MIT License.
* http://opensource.org/licenses/mit-license
*/
import html2canvas from 'html2canvas';

const html2pdf = (html,pdf)=>{
  return new Promise((resolve, reject)=>{
    try {
      var canvas = pdf.canvas;
      if (!canvas) {
        throw new Error('jsPDF canvas plugin not installed');
      }
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      var doc;
      doc = iframe.contentDocument;
      if (doc == undefined || doc == null) {
        doc = iframe.contentWindow.document;
      }

      canvas.pdf = pdf;
      pdf.annotations = {

        _nameMap : [],

        createAnnotation : function(href,bounds) {
          var x = pdf.context2d._wrapX(bounds.left);
          var y = pdf.context2d._wrapY(bounds.top);
          var page = pdf.context2d._page(bounds.top);
          var options;
          var index = href.indexOf('#');
          if (index >= 0) {
            options = {
              name : href.substring(index + 1)
            };
          } else {
            options = {
              url : href
            };
          }
          pdf.link(x, y, bounds.right - bounds.left, bounds.bottom - bounds.top, options);
        },

        setName : function(name,bounds) {
          var x = pdf.context2d._wrapX(bounds.left);
          var y = pdf.context2d._wrapY(bounds.top);
          var page = pdf.context2d._page(bounds.top);
          this._nameMap[name] = {
            page : page,
            x : x,
            y : y
          };
        }

      };
      canvas.annotations = pdf.annotations;

      pdf.context2d._pageBreakAt = function(y) {
        this.pageBreaks.push(y);
      };

      pdf.context2d._gotoPage = function(pageOneBased) {
        while (pdf.internal.getNumberOfPages() < pageOneBased) {
          pdf.addPage();
        }
        pdf.setPage(pageOneBased);
      }

      if (typeof html === 'string') {
        // remove all scripts
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        console.log('html', html);
        doc.open();
        doc.write(html);
        doc.close();

        var promise = html2canvas(doc.body, {
          canvas : canvas,
          onrendered : (canvas)=>{
            if (iframe) {
              iframe.parentElement.removeChild(iframe);
            }
            resolve(pdf);
          }
        });

      } else {
        var promise = html2canvas(html, {
          canvas : canvas,
          onrendered : function(canvas) {
            if (iframe) {
              iframe.parentElement.removeChild(iframe);
            }
            resolve(pdf);
          }
        });
      }
    } catch (e){
      reject(e);
    }
  });
}

export default html2pdf;
