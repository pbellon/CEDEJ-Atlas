import renderHtml from './renderHtml';
import htmlTo from './htmlTo';
import leafletImage from 'leaflet-image';

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

carto.preview = (mapRef)=>{
  return new Promise((resolve, reject) => {
    leafletImage(mapRef, (err, canvas)=>{
      if(err){
        reject(err);
      } else {
        resolve(canvas.toDataURL());
      }
    });
  });
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
