import preview from './preview';
import render from './render';
const carto = {};

// will render downloadable map, either a PDF or PNG.
carto.render = render; 


carto.preview = preview;

carto.download = ({ format, url }) => {
  return new Promise((resolve, reject) => {
    try {
      const a = document.createElement('a');
      const ts = `${(new Date()).getTime()}`.substring(5);
      a.href = url;
      a.target = '_blank';
      a.download = `export-${ts}.${format}`;
      console.log('going to download ', a.download);
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
