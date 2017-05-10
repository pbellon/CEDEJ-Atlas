import React from 'react';
import html2pdf from './html2pdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Atlas } from 'components';
import { Atlas as AtlasContainer } from 'containers';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import { injectGlobal, ThemeProvider } from 'styled-components'

import theme from 'components/themes/default'

import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { render } from 'react-dom';
import world from 'data/world.json';

const formats = {
  PDF: 'pdf',
  PNG: 'png'
};

const A2 = [594, 420]; // A2 in mm;
const A2px = A2.map((mm)=>mm*3.779528);
const carto = {};

carto.render = (data)=>{
  console.log('carto.render', data);
  return new Promise((resolve, reject)=>{
    renderHTML().then((html)=>{
      console.log('html rendered: ', html);
      convertTo(html, data.format)
        .then((blobURL)=>{ resolve({ url: blobURL, format:data.format }) })
        .catch((error)=>{
          console.error('An error occured while rendering', error);
          reject(error);
        });
    });
  });
}

carto.download = ({format, url})=>{
  return new Promise((resolve, reject)=>{
    try {
      const a = document.createElement('a');
      const ts = (""+(new Date()).getTime()).substring(5);
      a.href = url;
      a.target = "_blank";
      a.download = `export-${ts}.${format}`;
      document.body.appendChild(a);
      console.log('a', a);
      a.click();
      a.parentElement.removeChild(a);
      resolve(true);
    } catch (e) {
      console.error('error while downloading', e);
      reject(e);
    }
  });
}

const renderHTML = ()=>{
  return new Promise((resolve, reject)=>{
    const renderContainer = document.getElementById('render');
    console.log('renderContainer: ', renderContainer);
    const props = {
      print: true,
      width: 900,
      height: 400,
      onRender: (canvasURL)=>{
        const markup = render(<ThemeProvider theme={ theme }>
          <AtlasContainer canvasURL={ canvasURL }/>
        </ThemeProvider>, renderContainer);
        resolve(markup);
      }
    };
    const firstRender = render(<Atlas {...props }/>, renderContainer);
    console.log('first render');
  });
};


const convertTo = (html, format)=>{
  console.log('convertTo', format);
  return new Promise((resolve, reject)=>{
    let promise = null;
    switch (format) {
      case formats.PDF:
        promise = convertToPDF(html);
        break;
      case formats.PNG:
        promise = convertToPNG(html);
        break;
      default:
        promise = convertToPDF(html);
        break;
    }
    promise.then(resolve).catch(reject);
  });
}

const blobToURL = (blob)=>{
  return URL.createObjectURL(blob);
}

const convertToPDF = (html, opts)=>{
  return new Promise((resolve, reject)=>{
    const toBlob = (pdf)=>{
      return pdf.output('blob');
    };
    const defaultOpts = {
      orientation: 'landscape',
      unit: 'mm',
      format: A2
    };
    const options = Object.assign({}, defaultOpts, opts);

    html2pdf(html, (new jsPDF(options)))
      .then(toBlob)
      .then(blobToURL)
      .then(resolve)
      .catch(reject);
  });
}

const convertToPNG = (html)=>{
  const toBlob = (canvas)=>{
    debugger;
    return canvas.toBlob();
  }
  return new Promise((resolve, reject)=>{
    const promise = html2canvas(html, {
      width: A2px[0],
      height: A2px[1],
    });
    promise.then(toBlob)
      .then(blobToURL)
      .then(resolve)
      .catch(reject);
  })
}




export default carto;
