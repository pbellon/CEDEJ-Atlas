import renderHtml from './renderHtml';
import htmlTo from './htmlTo';
import leafletImage from 'leaflet-image';
import formats from 'utils/formats';
const { A4px } = formats;
const carto = {};
const rotatePreview = ({mapPreview, ...data})=>{
  return new Promise((resolve, reject)=>{
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      img.src = mapPreview;
      img.onload = ()=>{
        const iw = img.width;
        const ih = img.height;
        const cw = ih;
        const ch = iw;

        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        // rotation code took from
        // https://jsfiddle.net/AbdiasSoftware/Hq7p2/
        ctx.translate(cw*0.5, ch*0.5);
        ctx.rotate(-Math.PI/2);
        ctx.translate(-iw*0.5, -ih*0.5);
        ctx.drawImage(img,0,0);
        ctx.setTransform(1,0,0,1,0,0); 
        const newPreview = canvas.toDataURL('image/jpeg', 1);
        /* debug window
        window.open(
          newPreview,
          'Image générée',
          `width=${canvas.width} height=${canvas.height}`
        ); */
        resolve({mapPreview:newPreview, ...data}); 
      }
    } catch(e) {
      reject(e);
    }
  });
}
carto.render = (data) => {
  return new Promise((resolve, reject) => {
    rotatePreview(data).then((data)=>{
      renderHtml(data).then((html) => {
        htmlTo(html, data.format)
          .then((blobURL) =>{
            console.log('downloadable created !', blobURL);
            resolve({ url: blobURL, format: data.format })
          })
          .catch((error) => {
            debugger;
            console.error('An error occured while rendering', error);
            reject(error);
          });
      });
    })
  });
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
  ctx.beginPath();
  ctx.strokeStyle = '#666';
  ctx.fillStyle = '#000';
  ctx.lineWidth = 2;
  ctx.textAlign = 'end';
  const kmw = scaleWidth(kmScale);
  const kmt = scaleText(kmScale);
  ctx.moveTo(cw - offx, ch - offy - scaleHeight);
  ctx.lineTo(cw - offx, ch - offy);
  ctx.lineTo(cw - offx - kmw, ch - offy);
  ctx.lineTo(cw - offx - kmw, ch - offy - scaleHeight);
  ctx.stroke();
  ctx.fillText(kmt, cw - offx - 4, ch - offy - 4, kmw); 
  // then the mile scale
  const mw = scaleWidth(mileScale);
  const mt = scaleText(mileScale);
  ctx.moveTo(cw - offx, ch - (offy - scaleHeight));
  ctx.lineTo(cw - offx, ch - offy);
  ctx.lineTo(cw - offx - mw, ch - offy);
  ctx.lineTo(cw - offx - mw, ch - (offy - scaleHeight));
  ctx.stroke();
  ctx.fillText(mt, cw - offx - 4, ch - (offy - 14), mw); 
}

const addWatermarkToCanvas = (canvas, mapRef)=>{
  return new Promise((resolve, reject)=>{
    const ctx = canvas.getContext('2d');
    const { width: cw, height: ch } = canvas;
    const watermark = mapRef._controlContainer.querySelector('.leaflet-watermark img');
    const { width: iw, height: ih } = watermark;
    const img = new Image();
    const offx = 10;
    const offy = 10;
    img.src = watermark.src;
    img.onload = ()=>{
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
