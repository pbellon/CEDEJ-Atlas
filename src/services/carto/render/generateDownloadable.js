import jsPDF from 'jspdf';
import jsZIP from 'jszip';

import formats, { px2mm } from 'utils/formats'; 
import 'utils/canvasToBlob';
import rotatePreview from './rotatePreview'; 


const generateImagesArchive = ({
  mapPreview,
  legendImage,
  legendMoreInfosImage,
  format,
  ...data
}) => {
  const zip = new jsZIP();
  const addImage = (img, name)=>{
    return new Promise((resolve, reject)=>{
      img.toBlob((blob)=>{ 
        zip.file(`${name}.${format}`, blob);
        resolve();
      });
    });
  }

  return new Promise((resolve, reject)=>{
    Promise.all([
      addImage(mapPreview.canvas, 'map'),
      addImage(legendImage, 'legend'),
      addImage(legendMoreInfosImage, 'legend-infos')
    ]).then(()=>{
      zip.generateAsync({type: 'blob'}).then((blob) => {
        resolve({blob, format:'zip', ...data});
      }).catch(reject);
    })
  });
};

const generatePDF = ({
  mapPreview,
  legendImage,
  legendMoreInfosImage,
  ...data
}) => {
  let i = 0;
  const addPage = (pdf, img)=>{
    if(i > 0){
      pdf.addPage();
    }
    const imgData = img.toDataURL('image/png', 0.8);
    pdf.addImage(imgData, 0, 0, px2mm(img.width), px2mm(img.height));
    i += 1;
  }
  return new Promise((resolve, reject)=>{  
    try {
      const pdf = new jsPDF({unit: 'mm'});
      const { canvas } = pdf;
      addPage(pdf, mapPreview.canvas);
      addPage(pdf, legendImage);
      addPage(pdf, legendMoreInfosImage);
      const blob = pdf.output('blob');
      resolve({blob, ...data});
    } catch (e) {
      reject(e);
    }
  });
}

const generateBlob = ({ format, ...data })=>{
  switch(format){
    case formats.PDF: return rotatePreview({format, ...data}).then(generatePDF);
    case formats.PNG: return generateImagesArchive({format, ...data});
  }
}

const generateDownloadable = (data)=>{
  return generateBlob(data);
}

export default generateDownloadable;
