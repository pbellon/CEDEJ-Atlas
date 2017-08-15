/*
 * Author: Pierre Bellon <pierre@skoli.fr>
 */
import { BOUNDARIES } from './boundaries'; 

let PATTERNS = [
  {
    // hyper aride: pas de motif, bordure
    key: 'Hyper',
    stripes: null,
    boundaries: BOUNDARIES.TEETH,
  },{
    // aride: pas de motif, bordure pleine
    key: 'Aride',
    stripes: null,
    boundaries: BOUNDARIES.FULL,
  },{
    // semi-aride: motif -45*, bordure partielle (dashed)
    key: 'Semi',
    stripes: { gap:7, rotate: 45, thickness: 1 },
    boundaries: BOUNDARIES.DASHED,
  },{
    // sub-humide: motif -45* + 45, pas de bordure
    key: 'Sub_humide',
    stripes: { gap:7, rotate: 45, thickness: 1, plaid: true },
    boundaries: BOUNDARIES.NONE,
  }
];

const addStripes = (canvas, {
  mode='normal',
    color='black',
    rotate=45,
    offset=0,
    plaid=false,
    gap,
  thickness
}) => {
  const { width, height } = canvas;
  const ctx = canvas.getContext('2d');
  const diagLength = Math.sqrt( (width ** 2) + (height ** 2) );
  const stripeGap = gap || thickness;
  const tile = thickness + stripeGap;
  const repeats = ( (diagLength * 2) + offset ) / tile;

  ctx.strokeStyle = 'black';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeWidth = thickness;
  // clear canvas
  // ctx.clearRect(0, 0, width, height);

  for ( let i=0; i < repeats; i++ ) {
    // ctx.fillStyle =
    ctx.beginPath();
    const off = i * tile;
    const x = off - width;
    ctx.moveTo(x, 0);
    ctx.lineTo(0+off, width);
    ctx.stroke();
    if (plaid) {
      ctx.moveTo(x, height);
      ctx.lineTo(0+off, 0);
      ctx.stroke();
    }
    ctx.closePath();
  }
}

const createCanvasPattern = ({stripes}) => {
  const p = document.createElement('canvas');
  p.width = 16;
  p.height = 16;
  addStripes(p, stripes);
  return p;
};

export const findPattern = ({properties:{d_TYPE:type}}) => {
  return PATTERNS.find(({key}) => key == type);
};

export const initPatterns = (context) => {
  PATTERNS.forEach((pattern) => {
    if(pattern.stripes){
      const canvasPattern = createCanvasPattern(pattern);
      pattern.canvasPattern = context.createPattern(canvasPattern, 'repeat');
    }
  });
  return PATTERNS;
};

export const allPatterns = ()=>{ return PATTERNS; };
