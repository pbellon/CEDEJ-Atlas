import renderPrintLegend from './renderPrintLegend';
import generateDownloadable from './generateDownloadable';

const render = (data) => {
  return renderPrintLegend(data)// render legend as image
    .then(generateDownloadable);// generate the downloadable file
};

export default render;
