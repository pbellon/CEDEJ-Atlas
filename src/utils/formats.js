const FORMATS = {
  PDF: 'pdf',
  PNG: 'png',
  A4: [297, 210],
};

const PIXELS_PER_MM = 3.779528;
export const mm2px = mm => mm * PIXELS_PER_MM;
export const px2mm = px => Math.round(px / PIXELS_PER_MM);

FORMATS.A4px = FORMATS.A4.map(mm2px);

export default FORMATS;
