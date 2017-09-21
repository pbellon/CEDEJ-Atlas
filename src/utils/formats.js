const FORMATS = {
  PDF: 'pdf',
  PNG: 'png',
  A4: [297,210],
}

FORMATS.A4px = FORMATS.A4.map(mm => mm*3.779528);

export default FORMATS;
