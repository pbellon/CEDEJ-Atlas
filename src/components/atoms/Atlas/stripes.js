/*
 * Author: Pierre Bellon <pierre@skoli.fr>
 */
import { BOUNDARIES } from './boundaries'; 

const PATTERNS = [
	{
    // hyper aride: pas de motif, bordure
    key: '1',
    stripes: null,
    boundaries: BOUNDARIES.TEETH,
  },{
    // aride: pas de motif, bordure pleine
    key: '2',
    stripes: null,
    boundaries: BOUNDARIES.FULL,
  },{
    // semi-aride: motif -45*, bordure partielle (dashed)
    key: '3',
    stripes: { gap:7, rotate: 45, thickness: 1 },
    boundaries: BOUNDARIES.DASHED,
  },{
    // sub-humide: motif -45* + 45, pas de bordure
    key: '4',
    stripes: { gap:7, rotate: 45, thickness: 1, plaid: true },
    boundaries: BOUNDARIES.NONE,
  }
];

const addStripes = (canvas, {
    mode='normal',
    color='black',
    rotate=45,
    opacity=0.5,
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

  // clear canvas
  // ctx.clearRect(0, 0, width, height);

  for ( let i=0; i < repeats; i++ ) {
    // ctx.fillStyle =
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineCap = 'round';
    ctx.strokeWidth = thickness;
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
  }
}

const createCanvasPattern = ({stripes}) => {
  const p = document.createElement('canvas');
  p.width = 16;
  p.height = 16;
  addStripes(p, stripes);
  return p;
};

export const initPatterns = (context) => {
	return PATTERNS.map((pattern) => {
		if(!pattern.stripes){ return pattern; }
		const canvasPattern = createCanvasPattern(pattern);
		return {
			...pattern,
			pattern: context.createPattern(canvasPattern, 'repeat'),
		};
	});
};
