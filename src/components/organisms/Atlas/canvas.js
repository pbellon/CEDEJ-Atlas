import { path as d3Path } from 'd3-path'; 
import * as patternsUtil from 'utils/patterns';
import * as boundaries from 'utils/boundaries';
import { LatLng, Point } from 'leaflet';
import geojsonvt from 'geojson-vt';
import { debugCanvas } from 'utils';

import { areaColor } from './styles';
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
  return path;
}

const drawArea = ({context, area, drawPath, forceColor, strokeWidth=1})=>{
  const color = forceColor || areaColor(area.tags.Temperatur);
  context.lineWidth = strokeWidth;
  context.fillStyle = color;
  context.strokeStyle = color;
  context.beginPath();
  const path = new Path2D(drawPath(area, context));
  if(strokeWidth > 0){
    context.stroke(path);
  }
  context.fill(path, 'evenodd');
};

const drawPattern = ({context, aridity, drawPath, patterns}) => {
  const pattern = patterns.findByKey(aridity.tags.d_TYPE);
  if(!pattern){ return; }
  if(!pattern.stripes){ return; }
  context.fillStyle = pattern.canvasPattern;
  context.beginPath();
  const path = new Path2D(drawPath(aridity, context));
  context.fill(path, 'evenodd');
};

const tau = 2 * Math.PI;
export class CanvasDelegate {
  constructor(data){
    const self = this;
    this.shouldUseMask = false;
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

  enableMask(){
    this.shouldUseMask = true;
  }

  disableMask(){
    this.shouldUseMask = false;
  }

  createCanvas(modelCanvas){
    const canvas = document.createElement('canvas');
    canvas.width = modelCanvas.width;
    canvas.height = modelCanvas.height;
    return canvas;
  }

  createMask(modelCanvas, temperatures, aridity){
    let canvas;
    if(this.shouldUseMask){
      canvas = this.createCanvas(modelCanvas);
      const aridityCanvas = this.createCanvas(modelCanvas);
      const temperaturesCanvas = this.createCanvas(modelCanvas);
      this.drawAreas(
        aridityCanvas.getContext('2d'),
        aridity,
        'black',
        2 
      );
      
      this.drawAreas(
        temperaturesCanvas.getContext('2d'),
        temperatures,
        'black',
        0
      );
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(aridityCanvas,0,0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'xor';
      ctx.drawImage(temperaturesCanvas,0,0, canvas.width, canvas.height);
      ctx.clip();
    }
    return canvas;

  }
  setLayer(layer){ this.layer = layer; }
  updateData(data){
    this.processData(data);
  }

  draw({canvas, coords, size, layer}){
    const { aridity, temperatures } = this.getTileFeatures(coords);
    const {
      aridity:isAridityVisible,
      temperatures:isTemperaturesVisible 
    } = this.visibility;

    const mask = this.createMask(canvas, temperatures, aridity);
    const context = canvas.getContext("2d");
    const patterns = this.patterns = this.patterns || patternsUtil.initPatterns(context);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
    try { 
      if(isTemperaturesVisible){
        this.drawAreas(context, temperatures, null, 0);
      }

      if(isAridityVisible){
        this.drawAridityPatterns(context, aridity, patterns);
        boundaries.addBoundaries({
          context,
          patterns,
          drawPath: drawFeaturePath,
          boundaries: aridity,
          layer:this.layer,
        });
      }

      if(mask){
        context.globalCompositeOperation = 'destination-out';
        context.drawImage(mask, 0, 0, mask.width, mask.height);
      }
      context.clip();
    } catch(e) {
      console.error('error while drawing', e);
      throw e;
    }
    return canvas;
  }

  drawAreas(context, features, color, strokeWidth=1){
    let i = 0;
    const n = features.length;
    for(i; i < n; i++){
      // draw zones with different colors to do
      drawArea({
        area:features[i],
        context,
        drawPath:drawFeaturePath,
        forceColor:color,
        strokeWidth,
      });
    }
  }

  drawAridityPatterns(context, aridity, patterns){
    let i = 0;
    const n = aridity.length;
    for(i; i < n; i++){
      // create aridity textures and substract them from areas paths (if needed)
      // draw aridity boundaries (for certains kinds of aridity)
      drawPattern({
        aridity: aridity[i],
        patterns,
        context,
        drawPath:drawFeaturePath
      });
    }
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

