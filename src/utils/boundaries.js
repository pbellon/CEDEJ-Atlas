import { geoPath } from 'd3-geo';
// import * as patterns from './patterns';

const TEETH_GAP = 20;
const BOUNDARY_WIDTH = 1.33;

// inspiration from svg-path-properties
export class pathProperties {

  constructor(pathStr, id) {
    let path = document.querySelector(`#path-${id}`);
    if (!path) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `path-${id}`);
      const util = document.querySelector('#pathUtil');
      util.append(path);
    }
    path.setAttribute('d', pathStr);
    this.path = path;
  }

  tanAt(l) {
    const p1 = this.pointAt(l);
    const p2 = this.pointAt(l + 1);
    // took from https://github.com/rveciana/svg-path-properties/blob/master/src/linear.js
    const module = Math.sqrt(
      (
        (p2.x - p1.x) * (p2.x - p1.x)
      ) + (
        (p2.y - p1.y) * (p2.y - p1.y)
      )
    );
    return {
      x: (p2.x - p1.x) / module,
      y: (p2.y - p1.y) / module,
    };
  }

  pointAt(l) {
    return this.path.getPointAtLength(l);
  }

  totalLength() {
    return this.path.getTotalLength();
  }
}

export const BOUNDARIES = {
  TEETH: 'teeth',
  FULL: 'full',
  DASHED: 'dashed',
  NONE: null,
};

const deg2rad = (deg) => deg * (Math.PI / 180);
const rad2deg = (rad) => rad * (180 / Math.PI);

const triangleAt = (path, l, base = 4, height = 4) => {
  const point = path.properties.pointAt(l);
  const tan = path.properties.tanAt(l);
  const angle = Math.atan(tan.y / tan.x);
  // find the angle to rotate
  const triangleAngle = deg2rad(rad2deg(angle) - 90);
  const x0 = point.x - ((base / 2) * tan.x);
  const y0 = point.y - ((base / 2) * tan.y);

  const x1 = point.x + ((base / 2) * tan.x);
  const y1 = point.y + ((base / 2) * tan.y);

  const sx0 = point.x - (height * Math.cos(triangleAngle));
  const sy0 = point.y - (height * Math.sin(triangleAngle));

  const sx1 = point.x + (height * Math.cos(triangleAngle));
  const sy1 = point.y + (height * Math.sin(triangleAngle));

  return {
    base0: [x0, y0],
    base1: [x1, y1],
    tops: [[sx0, sy0], [sx1, sy1]],
  };
};

const teethBoundaries = ({ context, path, gap=TEETH_GAP }) => {
  // piste d'optimisation:
  // au lieu de faire (pour chaque triangle) une verif sur l'appartenance
  // d'un point à un chemin nous pouvons calculer le "centroid" de chaque
  // chemin puis tester la distance absolue entre ce centre et les sommet
  // du triangle.
  const path2d = new Path2D(path.path);
  const nbMarkers = Math.floor(path.length / gap) + 1;

  context.strokeStyle = 'rgba(0,0,0,1)';
  context.lineWidth = BOUNDARY_WIDTH;
  context.lineJoin = 'round';

  context.beginPath();
  context.stroke(path2d);
  context.closePath();
  context.fillStyle = 'rgba(0,0,0,1)';
  // optimisation possible: faire un prérendu des triangle et dessiner
  // ensuite les triangle
  context.beginPath();
  for (let i = 1; i <= nbMarkers; i += 1) {
    const l = i * gap;
    const { base0, base1, tops } = triangleAt(path, l);
    let top = tops.find(p => {
      const isInPath = context.isPointInPath(path2d, p[0], p[1]);
      return path.isExterior ? isInPath : !isInPath;
    });
    if (!top) { top = tops[0]; }

    context.moveTo(base0[0], base0[1]);
    context.lineTo(base1[0], base1[1]);
    context.lineTo(top[0], top[1]);
    context.fill();
  }
  context.closePath();
};

const fullBoundaries = ({ context, path }) => {
  const path2d = new Path2D(path.path);
  context.strokeStyle = 'rgba(0, 0, 0, 1)';
  context.lineWidth = BOUNDARY_WIDTH;
  context.beginPath();
  context.stroke(path2d);
  context.closePath();
};

const dashedBoundaries = ({ context, path }) => {
  const path2d = new Path2D(path.path);
  context.strokeStyle = 'rgba(0, 0, 0, 1)';
  context.lineWidth = BOUNDARY_WIDTH;
  context.setLineDash([5, 5]);
  context.beginPath();
  context.stroke(path2d);
  context.closePath();
  context.setLineDash([]);
};

export const addBoundary = ({ pattern, ...options }) => {
  switch (pattern.boundaries) {
    case BOUNDARIES.TEETH:
      teethBoundaries({ pattern, ...options });
      break;
    case BOUNDARIES.FULL:
      fullBoundaries({ pattern, ...options });
      break;
    case BOUNDARIES.DASHED:
      dashedBoundaries({ pattern, ...options });
      break;
    default:
      break;
  }
};

const initData = ({ boundaries, projection }) => {
  let i = 0;
  let boundary;
  const _boundaries = [];
  const len = boundaries.length;
  const fnPath = geoPath().projection(projection);

  for (i; i < len; i += 1) {
    boundary = boundaries[i];
    const path = fnPath(boundary);
    const id = `${boundary.properties.OBJECTID_1}-${i}`;
    // console.log('boundary id:', id);
    const properties = new pathProperties(path, id);
    _boundaries.push({
      isExterior: true,
      boundary,
      properties,
      length: properties.totalLength(),
      path,
    });
  }
  return _boundaries;
};

export const addBoundaries = ({
  patterns,
  boundaries,
  projection,
  ...options
}) => {
  let path;
  let i = 0;
  const pathes = initData({ boundaries, projection });
  const len = pathes.length;
  for (i; i < len; i += 1) {
    path = pathes[i];
    const pattern = patterns.findByFeature(path.boundary);
    if (pattern && pattern.boundaries) {
      addBoundary({ pattern, path, ...options });
    }
  }
};