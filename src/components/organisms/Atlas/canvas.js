import { areaColor } from './styles';
import { path as d3Path } from 'd3-path'; 
import * as patternsUtil from 'utils/patterns';
import * as boundaries from 'utils/boundaries';
import { LatLng, Point } from 'leaflet';
import geojsonvt from 'geojson-vt';

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

const tau = 2 * Math.PI;
export class CanvasDelegate {
  constructor(data){
    const self = this;
    this.visibility = {
      aridity: true,
      temperatures: true,
    };
    this.tileOptions = {
      maxZoom: 9,
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
  updateAridityVisibility(visibility){
    this.visibility.aridity = visibility;
  }
  updateTemperaturesVisibility(visibility){
    this.visibility.temperatures = visibility;
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
    const {
      aridity:isAridityVisible,
      temperatures:isTemperaturesVisible 
    } = this.visibility;

    // const zoom = Math.pow(2, 8 + zoomLevel) / 2 / Math.PI; 
    const context = canvas.getContext("2d");
    const patterns = this.patterns = this.patterns || patternsUtil.initPatterns(context);

    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.translate(origin.x, origin.y);
    if(isTemperaturesVisible){
      n = temperatures.length;
      context.globalCompositeOperation = 'source-over';
      for(i = 0; i < n; i++){
        // draw zones with different colors to do
        drawArea({area:temperatures[i], context, drawPath:drawFeaturePath});
      }
    }
    if(isAridityVisible){
      n = aridity.length;
      context.globalCompositeOperation = 'destination-out';
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

      context.globalCompositeOperation = 'source-over';
      boundaries.addBoundaries({
        context,
        patterns,
        drawPath: drawFeaturePath,
        boundaries: aridity,
        layer:this.layer,
      });
    }
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

