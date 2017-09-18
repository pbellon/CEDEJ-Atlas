import { areaColor } from './styles';
import { geoTransform, geoPath, geoMercator } from 'd3-geo';
import { path as d3Path } from 'd3-path'; 
import * as patternsUtil from 'utils/patterns';
import * as boundaries from 'utils/boundaries';
import { LatLng, Point } from 'leaflet';
import geojsonvt from 'geojson-vt';
import * as topojson from 'topojson-client';


const drawFeaturePath = (feature, ctx, pad=0, ratio=1)=>{
  const type = feature.type;
  ratio = ctx.canvas.height / 4096;
  const path = d3Path();
  for (var j = 0; j < feature.geometry.length; j++) {
    var geom = feature.geometry[j];

    if (type === 1) {
      path.arc(geom[0] * ratio + pad, geom[1] * ratio + pad, 2, 0, 2 * Math.PI, false);
      continue;
    }

    for (var k = 0; k < geom.length; k++) {
      var p = geom[k];
      if (k) path.lineTo(p[0] * ratio + pad, p[1] * ratio + pad);
      else path.moveTo(p[0] * ratio + pad, p[1] * ratio + pad);
    }
  }
  // if (type === 3 || type === 1) ctx.fill('evenodd');
  // ctx.stroke();
  return path;
}

const drawArea = ({context, area, drawPath})=>{
  const color = areaColor(area.tags.Temperatur);
  context.fillStyle = color;
  context.strokeStyle = color;
  context.beginPath();
  const path = new Path2D(drawPath(area, context));
  context.stroke(path);
  context.fill(path);
};

const drawPattern = ({context, aridity, drawPath, patterns}) => {
  const pattern = patterns.findByKey(aridity.tags.d_TYPE);
  if(!pattern){ return; }
  if(!pattern.stripes){ return; }
  context.fillStyle = pattern.canvasPattern;
  context.beginPath();
  const path = new Path2D(drawPath(aridity, context));
  context.fill(path);
};

// took from https://jsfiddle.net/070m3jk7/
function vectorTileToGeoJSON(tile, {x,y,z}) {
  var result = [];
  for (var i = 0; i < tile.features.length; i++) {
    result.push(featureToGeoJSON(tile.features[i], z, x, y));
  }
  return result;
}

function featureToGeoJSON(feature, z, x, y) {
  const extent = 4096;
  const types = ['Unknown', 'Point', 'LineString', 'Polygon'];

  var size = extent * z,
    x0 = extent * x,
    y0 = extent * y,
    coords = feature.geometry,
    type = types[feature.type],
    i, j;


  function project(line) {
    for (var j = 0; j < line.length; j++) {
      var p = line[j],
        y2 = 180 - (p[1] + y0) * 360 / size;

      line[j] = [
        (p[0] + x0) * 360 / size - 180,
        360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
      ];
    }
  }

  switch (feature.type) {
    case 1:
      var points = [];
    for (i = 0; i < coords.length; i++) {
      points[i] = coords[i][0];
    }
    coords = points;
    project(coords);
    break;

    case 2:
      for (i = 0; i < coords.length; i++) {
      project(coords[i]);
    }
    break;

    case 3:
      coords = classifyRings(coords);
    for (i = 0; i < coords.length; i++) {
      for (j = 0; j < coords[i].length; j++) {
        project(coords[i][j]);
      }
    }
    break;
  }

  if (coords.length === 1) {
    coords = coords[0];
  } else {
    type = 'Multi' + type;
  }

  var result = {
    type: "Feature",
    geometry: {
      type: type,
      coordinates: coords
    },
    properties: feature.tags
  };

  if (this && this.id) {
    result.id = this.id;
  }

  return result;
}

function classifyRings(rings) {
  var len = rings.length;

  if (len <= 1) return [rings];

  var polygons = [],
    polygon,
  ccw;

  for (var i = 0; i < len; i++) {
    var area = signedArea(rings[i]);
    if (area === 0) continue;

    if (ccw === undefined) ccw = area < 0;

    if (ccw === area < 0) {
      if (polygon) polygons.push(polygon);
      polygon = [rings[i]];

    } else {
      polygon.push(rings[i]);
    }
  }
  if (polygon) polygons.push(polygon);

  return polygons;
}

function signedArea(ring) {
  var sum = 0;
  for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
    p1 = ring[i];
    p2 = ring[j];
    sum += (p2.x - p1.x) * (p1.y + p2.y);
  }
  return sum;
}
const tau = 2 * Math.PI;
export class CanvasDelegate {
  constructor(data){
    const self = this;

    this.tileOptions = {
      maxZoom: 14,
      tolerance: 3,
      extent: 4096,
      buffer: 64,
      debug: 0,
      indexMaxZoom: 3,
      indexMaxPoints: 10000,
      solidChildren: false,
    };
    this.processData(data);
  }

  processData(data){
    const { temperatures, aridity } = data;

    this.temperatures = temperatures;
    this.aridity = aridity;
    this.tiled = {
      aridity: geojsonvt(this.aridity, this.tileOptions),
      temperatures: geojsonvt(this.temperatures, this.tileOptions),
    };
  }

  getTileFeatures({x, y, z}){
    const { aridity, temperatures } = this.tiled;
    const tAridity = aridity.getTile(z,x,y);
    const tTemps = temperatures.getTile(z,x,y);
    const tileToJSON = (tile, coords)=>(
      tile ? vectorTileToGeoJSON(tile, coords) : []
    );
    return {
      aridity: tAridity ? tAridity.features : [],
      temperatures: tTemps ? tTemps.features : [],
    };
  }
  setLayer(layer){ this.layer = layer; }
  updateData(data){
    this.processData(data);
  }

  draw({canvas, coords, size, layer}){
    let i, n;

    const { aridity, temperatures } = this.getTileFeatures(coords);

    // const zoom = Math.pow(2, 8 + zoomLevel) / 2 / Math.PI; 
    const context = canvas.getContext("2d");
    const tx = coords.x * size.x;
    const ty = coords.y * size.y;
    const scale = coords.z / tau;

    const projection = geoTransform({
      point:function(x,y){
        const pointLatLng = new LatLng(y,x);
        const tileOrigin = new Point(tx, ty);
        const point = layer._map.latLngToLayerPoint(pointLatLng)
        .subtract(tileOrigin);
        this.stream.point(point.x, point.y)
      }
    });
    // const drawPath = geoPath().projection(projection).context(context);

    const patterns = this.patterns = this.patterns || patternsUtil.initPatterns(context);

    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.translate(origin.x, origin.y);
    context.globalCompositeOperation = 'source-over';

    n = temperatures.length;
    for(i = 0; i < n; i++){
      // draw zones with different colors to do
      drawArea({area:temperatures[i], context, drawPath:drawFeaturePath});
    }
    console.log('drawn',n,'temps');
    context.globalCompositeOperation = 'destination-out';

    n = aridity.length;
    for(i = 0; i < n; i++){
      // create aridity textures and substract them from areas paths (if needed)
      // draw aridity boundaries (for certains kinds of aridity)
      drawPattern({
        aridity: aridity[i],
        patterns,
        context,
        drawPath:drawFeaturePath
      });
    }

    console.log('drawn',n,'aridity');
    context.globalCompositeOperation = 'source-over';
    boundaries.addBoundaries({
      projection,
      context,
      patterns,
      drawPath: drawFeaturePath,
      boundaries: aridity,
      layer:this.layer,
    });
    
    return canvas;

  }
  render(args){
    return new Promise((resolve, reject)=>{
      try {
        const canvas = this.draw(args);
        resolve(canvas);
      } catch(e){
        reject(e);
      }
    });
  }
}

