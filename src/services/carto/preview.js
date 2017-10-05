import leafletImage from 'leaflet-image';
import formats from 'utils/formats';

import { Watermark } from 'images';

const { A4px } = formats;

const mapToImage = (mapRef) => {
  return new Promise((resolve, reject) => {
    leafletImage(mapRef, (err, canvas) => {
      if (err) {
        reject(err);
      } else {
        resolve({ canvas, mapRef });
      }
    }, { x: A4px[0], y: A4px[1] });
  });
};

const addScaleToCanvas = (canvas, mapRef) => {
  const scaleHeight = 17;
  const scaleWidth = (scale) => parseInt(scale.style.width.replace('px', ''), 10);
  const scaleText = (scale) => scale.innerText;
  const ctx = canvas.getContext('2d');
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
};

const addWatermarkToCanvas = (canvas) => {
  return new Promise((resolve) => {
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
    };
  });
};

const addMapOverlay = ({ canvas, mapRef }) => {
  return new Promise((resolve, reject) => {
    try {
      addScaleToCanvas(canvas, mapRef);
      addWatermarkToCanvas(canvas, mapRef).then((canvas) => {
        resolve({
          canvas,
          url: canvas.toDataURL('image/png', 1),
        });
      }).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

const preview = (mapRef) => {
  return mapToImage(mapRef).then(addMapOverlay);
};

export default preview;
