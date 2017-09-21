import jsPDF from 'jspdf';
import { px2mm } from 'utils/formats'; 

const generatePDF = ({mapPreview, legendImage, ...data})=>{
  let i = 0;
  const addPage = (pdf, img)=>{
    if(i > 0){
      pdf.addPage();
    }
    const imgData = img.toDataURL('image/png', 1);
    pdf.addImage(imgData, 0, 0, px2mm(img.width), px2mm(img.height));
    i += 1;
  }
  return new Promise((resolve, reject)=>{  
    try {
      const pdf = new jsPDF({unit: 'mm'});
      const { canvas } = pdf;
      addPage(pdf, mapPreview);
      addPage(pdf, legendImage);
      resolve({pdf, ...data});
    } catch (e) {
      reject(e);
    }
  });
}

export default generatePDF;
