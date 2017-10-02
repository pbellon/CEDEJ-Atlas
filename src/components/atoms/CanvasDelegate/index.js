import { path as d3Path } from 'd3-path'; 
import geojsonvt from 'geojson-vt';
import { isFunction } from 'utils';


class CanvasDelegate {
  constructor(data){
    this.tiled = {};
    this.tileOptions = {
      maxZoom: 7,
      tolerance: 2,
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
    Object.keys(data).forEach(key => {
      this.tiled[key] = geojsonvt(data[key], this.tileOptions);
    });
  }

  getTileFeatures({x, y, z}){
    const res = {};
    Object.keys(this.tiled).forEach(key => {
      const fTiled = this.tiled[key].getTile(z,x,y);
      res[key] = fTiled ? fTiled.features : [];
    })
    return res;
  }

  createCanvas(modelCanvas){
    const canvas = document.createElement('canvas');
    canvas.width = modelCanvas.width;
    canvas.height = modelCanvas.height;
    return canvas;
  }
  setLayer(layer){ this.layer = layer; }
  updateData(data){
    this.processData(data);
  }

  draw(){
    throw new Error('You have to implement the draw method !');
  }
  
  drawPath(feature, ctx, pad=0){
    const type = feature.type;
    const ratio = ctx.canvas.height / 4096;
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

  drawArea({
    context,
    area,
    fillStyle,
    strokeStyle,
    strokeWidth=1
  }){
    context.lineWidth = strokeWidth;
    context.fillStyle = fillStyle;
    if(strokeStyle){
      context.strokeStyle = strokeStyle;
    }
    // context.beginPath();
    const path = new Path2D(this.drawPath(area, context));
    if(strokeWidth > 0){
      context.stroke(path);
    }
    context.fill(path, 'evenodd');
    // context.closePath();
  }

  drawAreas({context, features, fillStyle, strokeStyle, strokeWidth=1, stopCondition}){
    let i = 0;
    const n = features.length;
    for(i; i < n; i++){
      const area = features[i];
      if(stopCondition){
        if(stopCondition(area)){ continue; }
      }
      const fill = isFunction(fillStyle) ? fillStyle(area) : fillStyle;
      const stroke = isFunction(strokeStyle) ? strokeStyle(area) : strokeStyle;
      const strokeW = isFunction(strokeWidth) ? strokeWidth(area) : strokeWidth;
      // draw zones with different colors to do
      this.drawArea({
        area,
        context,
        fillStyle:fill,
        strokeStyle:stroke,
        strokeWidth:strokeW,
      });
    }
  }
}

export default CanvasDelegate;
