import renderPrintLegend from './renderPrintLegend';
import generatePDF from './generatePDF'; 
import rotatePreview from './rotatePreview'; 

import leafletImage from 'leaflet-image';
import formats from 'utils/formats';

import { Watermark } from 'images';
const { A4px } = formats;
const carto = {};

const convertPDF = ({pdf, format})=>{
  const toPNG = (pdf, format) => {
    return new Promise((resolve, reject)=>{
      const blob = pdf.output('blob');
      const url = blob.toDataURL('image/png', 1);
      resolve({url, format});
    });
  };
  
  const toPDF = (pdf, format) => {
    return new Promise((resolve, reject)=>{
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      resolve({url, format});
    });
  };
  let promise;
  switch (format) {
    case formats.PNG:
      promise = toPNG(pdf, format);
      break;
    case formats.PDF:
      promise = toPDF(pdf, format);
      break;
    default:
      promise = toPDF(pdf, format);
      break;
  }
  return promise;
}

carto.render = (data) => {
  return rotatePreview(data)
    .then(renderPrintLegend)
    .then(generatePDF)
    .then(convertPDF);
};


const addScaleToCanvas = (canvas, mapRef)=>{
  const scaleHeight = 17;
  const scaleWidth = (scale)=>parseInt(scale.style.width.replace('px', ''));
  const scaleText  = (scale)=>scale.innerText;
  const ctx = canvas.getContext('2d');
  let i = 0;
  const { width: cw, height: ch } = canvas;
  const scales = mapRef._controlContainer.querySelectorAll('.leaflet-control-scale-line');
  const kmScale = scales[0];
  const mileScale = scales[1];
  // first we draw the km scale.
  const offy = 100; 
  const offx = 10;
  const rectFill = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.textAlign = 'end';
  const kmw = scaleWidth(kmScale);
  const kmt = scaleText(kmScale);
  ctx.fillStyle = rectFill;
  ctx.fillRect(cw - offx - kmw, ch - offy - scaleHeight, kmw, scaleHeight);
  
  ctx.moveTo(cw - offx, ch - offy - scaleHeight);
  ctx.lineTo(cw - offx, ch - offy);
  ctx.lineTo(cw - offx - kmw, ch - offy);
  ctx.lineTo(cw - offx - kmw, ch - offy - scaleHeight);
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.fillText(kmt, cw - offx - 4, ch - offy - 4, kmw); 
  // then the mile scale
  const mw = scaleWidth(mileScale);
  const mt = scaleText(mileScale);

  ctx.fillStyle = rectFill;
  ctx.fillRect(cw - offx - mw, ch - offy, mw, scaleHeight);
  
  ctx.moveTo(cw - offx, ch - (offy - scaleHeight));
  ctx.lineTo(cw - offx, ch - offy);
  ctx.lineTo(cw - offx - mw, ch - offy);
  ctx.lineTo(cw - offx - mw, ch - (offy - scaleHeight));
  ctx.stroke();
  
  ctx.fillStyle = '#000';
  ctx.fillText(mt, cw - offx - 4, ch - (offy - 14), mw);
  ctx.closePath();
}

const addWatermarkToCanvas = (canvas, mapRef)=>{
  return new Promise((resolve, reject)=>{
    const ctx = canvas.getContext('2d');
    const { width: cw, height: ch } = canvas;
    const img = new Image();
    const offx = 10;
    const offy = 10;
    img.src = Watermark;
    img.onload = () => {
      const { width: iw, height: ih } = img;
      ctx.drawImage(img, cw - offx - iw, ch - offy - ih, iw, ih);
      resolve(canvas);
    }
  });
};

carto.preview = (mapRef)=>{
  const addMapOverlay = ({canvas, mapRef})=>{
    return new Promise((resolve, reject)=>{
      try {
        addScaleToCanvas(canvas, mapRef);
        addWatermarkToCanvas(canvas, mapRef).then((canvas)=>{
          resolve(canvas.toDataURL('image/jpeg', 1));
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }
  const mapToImage = (mapRef)=>{
    return new Promise((resolve, reject) => {
      leafletImage(mapRef, (err, canvas)=>{
        if(err){
          reject(err);
        } else {
          resolve({canvas, mapRef});
        }
      }, {x: A4px[0], y: A4px[1]});
    });
  };
  
  return mapToImage(mapRef).then(addMapOverlay);
}

carto.download = ({ format, url }) => {
  return new Promise((resolve, reject) => {
    try {
      const a = document.createElement('a');
      const ts = `${(new Date()).getTime()}`.substring(5);
      a.href = url;
      a.target = '_blank';
      a.download = `export-${ts}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.parentElement.removeChild(a);
      resolve(true);
    } catch (e) {
      console.error('error while downloading', e);
      reject(e);
    }
  });
};

export default carto;
