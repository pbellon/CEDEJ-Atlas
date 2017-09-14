import renderHtml from './renderHtml';
import htmlTo from './htmlTo';
import leafletImage from 'leaflet-image';

const carto = {};

carto.render = (data) => {
  return new Promise((resolve, reject) => {
    renderHtml().then((html) => {
      htmlTo(html, data.format)
        .then((blobURL) => resolve({ url: blobURL, format: data.format }))
        .catch((error) => {
          console.error('An error occured while rendering', error);
          reject(error);
        });
    });
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
