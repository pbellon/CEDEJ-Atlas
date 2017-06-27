import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapLayer } from 'react-leaflet';
import { areaColor } from './styles';
import * as d3 from 'd3';
import * as patternsUtil from './patterns';
import * as boundaries from './boundaries'; 
import * as topojson from 'topojson';
import canvasLayer from './layer';
import L from 'leaflet';

const { pointsToPath } = L.SVG; 

const drawArea = ({context, area, drawPath})=>{
  const color = areaColor(area);
  context.fillStyle = color;
  context.strokeStyle = color;
  context.beginPath();
  drawPath(area);
  context.fill();
};

const	drawPattern = ({context, aridity, drawPath}) => {
  const pattern = patternsUtil.findPattern(aridity);
  if(!pattern){ return; }
  if(!pattern.stripes){ return; }
  context.fillStyle = pattern.canvasPattern;
  context.beginPath();
  drawPath(aridity);
  context.fill();
};

export class CanvasDelegate {
  constructor(data){ this.data = data; }

  processData(){
    const { temperatures, aridity } = this.data;

    this.temperatures = this.temperatures || temperatures.features.filter((f)=>(+f.properties.Temperatur) > 0);
    this.aridity = this.aridity || aridity.features.filter((f)=>f.properties.d_TYPE != null);
  }


  onDrawLayer({canvas, bounds, center, zoom:zoomLevel, layer}){
    this.layer = layer;
    this.canvas =  canvas;
    this.bounds = bounds; 
    this.processData();
    const projection = d3.geoTransform({
      point:function(x,y){
        const pointLatLng = new L.LatLng(y,x);
        const point = layer._map.project(pointLatLng, zoomLevel);
        this.stream.point(point.x, point.y)
        // this.stream.point(point.x-bounds.left, point.y-bounds.top);
      }
    });

    // const zoom = Math.pow(2, 8 + zoomLevel) / 2 / Math.PI; 
    const context = canvas.getContext("2d");
    const drawPath = d3.geoPath().projection(projection).context(context);
    const patterns = this.patterns = this.patterns || patternsUtil.initPatterns(context);

    context.clearRect(0, 0, canvas.width, canvas.height);
    // context.translate(origin.x, origin.y);
    context.globalCompositeOperation = 'source-over';
    // draw zones with different colors to do
    this.temperatures.forEach((temp)=>drawArea({area:temp, context, drawPath}));

    context.globalCompositeOperation = 'destination-out';
    // create aridity textures and substract them from areas paths (if needed)
    // draw aridity boundaries (for certains kinds of aridity)
    this.aridity.forEach((aridity)=>drawPattern({aridity, context, drawPath}));

    context.globalCompositeOperation = 'source-over';
    boundaries.addBoundaries({
      projection,
      context,
      boundaries: this.aridity,
      layer,
    });
    // console.log('onDrawLayer drawn !');
  }
}
export default class CanvasLayer extends MapLayer {
  static propTypes = {
    delegate: PropTypes.object,
    zIndex: PropTypes.number,
    bbox: PropTypes.array,
  }

  createLeafletElement(props){
    const { delegate, ...options }= this.getOptions(props);
    console.log(options, props);
    const { pane } = this.context;
    return canvasLayer(delegate, pane, options);
  }

}
