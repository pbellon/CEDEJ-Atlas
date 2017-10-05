/*
 * Author: Pierre Bellon <pierre@skoli.fr>
 */
import { fakeContext } from 'utils';
import { BOUNDARIES } from './boundaries';

const PATTERNS = [
  {
    // hyper aride: pas de motif, bordure
    key: 'Hyper',
    stripes: null,
    boundaries: BOUNDARIES.TEETH,
  }, {
    // aride: pas de motif, bordure pleine
    key: 'Aride',
    stripes: null,
    boundaries: BOUNDARIES.FULL,
  }, {
    // semi-aride: motif -45*, bordure partielle (dashed)
    key: 'Semi',
    stripes: { gap: 7, rotate: 45, thickness: 1 },
    boundaries: BOUNDARIES.DASHED,
  }, {
    // sub-humide: motif -45* + 45, pas de bordure
    key: 'Sub_humide',
    stripes: { gap: 7, rotate: 45, thickness: 1, plaid: true },
    boundaries: BOUNDARIES.NONE,
  },
];

const addStripes = (canvas, {
  // mode = 'normal',
  // color='black',
  offset = 0,
  plaid = false,
  gap,
  thickness,
}) => {
  const { width, height } = canvas;
  const ctx = canvas.getContext('2d');
  const diagLength = Math.sqrt((width ** 2) + (height ** 2));
  const stripeGap = gap || thickness;
  const tile = thickness + stripeGap;
  const repeats = ((diagLength * 2) + offset) / tile;

  ctx.strokeStyle = '#BFBFBF';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeWidth = thickness;
  // clear canvas
  // ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < repeats; i += 1) {
    // ctx.fillStyle =
    ctx.beginPath();
    const off = 0 + (i * tile);
    const x = off - width;
    ctx.moveTo(x, 0);
    ctx.lineTo(off, width);
    ctx.stroke();
    if (plaid) {
      ctx.moveTo(x, height);
      ctx.lineTo(off, 0);
      ctx.stroke();
    }
    ctx.closePath();
  }
};

const createCanvasPattern = ({ stripes }) => {
  const p = document.createElement('canvas');
  p.width = 16;
  p.height = 16;
  addStripes(p, stripes);
  return p;
};

export const findPatternByValue = (value) => (
  PATTERNS.find(({ key }) => key === value)
);

export const findPattern = ({ properties: { d_TYPE: type } }) => {
  return PATTERNS.find(({ key }) => key === type);
};

class PatternList {
  constructor(patterns, context = fakeContext()) {
    this.patterns = patterns;
    this.context = context;
    this.initPatterns();
  }

  initPatterns() {
    this.patterns = this.patterns.map(pattern => {
      let _pattern = pattern;
      if (pattern.stripes) {
        const canvasPattern = createCanvasPattern(pattern);
        _pattern = {
          ...pattern,
          canvasPattern: this.context.createPattern(canvasPattern, 'repeat'),
        };
      }
      return _pattern;
    });
  }

  findByKey(_key) { return this.patterns.find(({ key }) => key === _key); }

  findByFeature(aridity) {
    return this.findByKey(aridity.properties.d_TYPE);
  }

  all() { return this.patterns; }
}

export const initPatterns = (context) => {
  return new PatternList(PATTERNS, context);
};
