import { areaColor } from './styles';
import { geoTransform, geoPath} from 'd3-geo';
import * as patternsUtil from './patterns';
import * as boundaries from './boundaries'; 
import { LatLng } from 'leaflet';

const drawArea = ({context, area, drawPath})=>{
  const color = areaColor(area);
  context.fillStyle = color;
  context.strokeStyle = color;
  context.beginPath();
  drawPath(area);
  context.stroke();
  context.fill();
};

const drawPattern = ({context, aridity, drawPath}) => {
  const pattern = patternsUtil.findPattern(aridity);
  if(!pattern){ return; }
  if(!pattern.stripes){ return; }
  context.fillStyle = pattern.canvasPattern;
  context.beginPath();
  drawPath(aridity);
  context.fill();
};

export class CanvasDelegate {
  constructor(data){
    this.processData(data);
  }

  processData(data){
    const { temperatures, aridity } = data;

    this.temperatures = temperatures
      .filter((f)=>(+f.properties.Temperatur) > 0);

    this.aridity = aridity
      .filter((f)=>f.properties.d_TYPE != null);
  }
  
  updateData(data){
    this.processData(data);
  }

  draw({canvas, zoom:zoomLevel, layer}){
    let i, n;

    const projection = geoTransform({
      point:function(x,y){
        const pointLatLng = new LatLng(y,x);
        const point = layer._map.project(pointLatLng, zoomLevel);
        this.stream.point(point.x, point.y)
        // this.stream.point(point.x-bounds.left, point.y-bounds.top);
      }
    });

    // const zoom = Math.pow(2, 8 + zoomLevel) / 2 / Math.PI; 
    const context = canvas.getContext("2d");
    const drawPath = geoPath().projection(projection).context(context);
    const patterns = this.patterns = this.patterns || patternsUtil.initPatterns(context);

    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.translate(origin.x, origin.y);
    context.globalCompositeOperation = 'source-over';
    
    n = this.temperatures.length;
    for(i = 0; i < n; i++){
      // draw zones with different colors to do
      drawArea({area:this.temperatures[i], context, drawPath});
    }
    context.globalCompositeOperation = 'destination-out';
    
    n = this.aridity.length;
    for(i = 0; i < n; i++){
      // create aridity textures and substract them from areas paths (if needed)
      // draw aridity boundaries (for certains kinds of aridity)
      drawPattern({
        aridity: this.aridity[i],
        context,
        drawPath
      });
    }
    context.globalCompositeOperation = 'source-over';
    boundaries.addBoundaries({
      projection,
      context,
      boundaries: this.aridity,
      layer,
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
        // console.log('onDrawLayer drawn !');
  }
}

