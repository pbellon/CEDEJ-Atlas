import React from 'react';
import html2pdf from './html2pdf';
import { Atlas } from 'containers';
import Html from 'components/Html';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

const formats = {
  PDF: 'pdf',
  PNG: 'png'
};
const A2 = [594, 420]; // A2 in mm;
const A2px = A2.map((mm)=>mm*3.779528);

const renderHTML = ()=>{
  const styles = styleSheet.rules().map(rule => rule.cssText).join('\n');
  const content = renderToString(<Atlas print={ true }/>);
  const markup = (<div>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: content }}/>
  </div>);

  const doctype = '<!doctype html>\n';
  return doctype+renderToStaticMarkup(markup);
};

const convertToPDF = (html, opts)=>{
  return new Promise((resolve, reject)=>{
    try {
      const defaultOpts = {
        orientation: 'landscape',
        unit: 'mm',
        format: A2
      };
      const options = Object.assign({}, defaultOpts, opts);
      const PDF = new jsPDF(options);
      html2pdf(html, PDF, resolve);
    } catch(e) {
      reject(e);
    }
  });
}

const convertToPNG = (html)=>{
  return new Promise((resolve, reject)=>{
    html2canvas(html, {
      width: A2px[0],
      height: A2px[1],
      onrender: function(canvas){
        debugger;
      }
    })
  })
}

const convertTo = (html, format)=>{
  return new Promise((resolve, reject)=>{
    let promise = null;
    switch (format) {
      case formats.PDF:
        promise = convertToPDF(html);
      case formats.PNG:
        promise = convertToPNG(html);
      default:
        promise = convertToPDF(html);
    }
    promise.then(resolve).catch(reject);
  });
}
const carto = {};

carto.render = (data)=>{
  console.log('carto.render');
  return new Promise((resolve, reject)=>{
    const html = renderHTML();
    convertTo(html, data.format)
      .then((converted)=>{
        debugger;
      }).catch((error)=>{
        console.error('An error occured while rendering', error);
        reject(error);
      });

  });
}


export default carto;
