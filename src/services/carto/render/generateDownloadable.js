import jsPDF from 'jspdf';
import jsZIP from 'jszip';

import formats, { px2mm } from 'utils/formats'; 

import rotatePreview from './rotatePreview'; 

const generateImagesArchive = ({ mapPreview, legendImage, format, ...data }) => {
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
      addImage(legendImage, 'legend')
    ]).then(()=>{
      zip.generateAsync({type: 'blob'}).then((blob) => {
        resolve({blob, format:'zip', ...data});
      }).catch(reject);
    })
  });
};

const generatePDF = ({mapPreview, legendImage, ...data})=>{
  let i = 0;
  const addPage = (pdf, img)=>{
    if(i > 0){
      pdf.addPage();
    }
    const imgData = img.toDataURL('image/png', 0.9);
    pdf.addImage(imgData, 0, 0, px2mm(img.width), px2mm(img.height));
    i += 1;
  }
  return new Promise((resolve, reject)=>{  
    try {
      const pdf = new jsPDF({unit: 'mm'});
      const { canvas } = pdf;
      addPage(pdf, mapPreview.canvas);
      addPage(pdf, legendImage);
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

const toDataURL = ({blob, ...data})=>{
  return new Promise((resolve, reject)=>{
    try {
      const url = URL.createObjectURL(blob);
      resolve({ url, ...data });
    } catch (e) {
      reject(e);
    }
  })
};

const generateDownloadable = (data)=>{
  return generateBlob(data).then(toDataURL);
}

export default generateDownloadable;
