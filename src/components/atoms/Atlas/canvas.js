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

const drawArea = ({context, area, drawPath})=>{
	const color = areaColor(area);
	context.fillStyle = color;
	context.strokeStyle = color;
	context.beginPath();
	drawPath(area);
	context.fill();
}

const	drawPattern = ({context, aridity, drawPath}) => {
	const pattern = patternsUtil.findPattern(aridity);
	if(!pattern){ return; }
	if(!pattern.stripes){ return; }
	context.fillStyle = pattern.canvasPattern;
	context.beginPath();
	drawPath(aridity);
	context.fill();
}

export class CanvasDelegate {
	constructor(data){ this.data = data; }
	onDrawLayer({canvas, bounds, center, zoom:zoomLevel, layer}){
		const projection = d3.geoTransform({
		    point:function(x,y){
					const pointLatLng = new L.LatLng(y,x);
					const point = layer._map.latLngToLayerPoint(pointLatLng);
					this.stream.point(point.x-bounds.left, point.y-bounds.top)
				}
		});	
		
		const zoom = Math.pow(2, 8 + zoomLevel) / 2 / Math.PI; 
		const context = canvas.getContext("2d");
		const {
			temperatures:{ features:temperatures },
			aridity:{ features:aridity }
		} = this.data;
		const drawPath = d3.geoPath().projection(projection).context(context);
		const patterns = patternsUtil.initPatterns(context);

		context.clearRect(0, 0, canvas.width, canvas.height);
		// context.translate(origin.x, origin.y);
		context.globalCompositeOperation = 'source-over';
		// draw zones with different colors to do
		// context.globalCompositeOperation = 'destination-in';
		temperatures.forEach((temp)=>drawArea({area:temp, context, drawPath}));

		context.globalCompositeOperation = 'destination-out';
		// create aridity textures and substract them from areas paths (if needed)
		// draw aridity boundaries (for certains kinds of aridity)
		aridity.forEach((aridity)=>drawPattern({aridity, context, drawPath}));

		context.globalCompositeOperation = 'source-over';
		boundaries.addBoundaries({
			projection,
			context,
			boundaries: aridity
		});
		// console.log('onDrawLayer drawn !');
	}
}
export default class CanvasLayer extends MapLayer {
	static propTypes = {
		delegate: PropTypes.object,
		zIndex: PropTypes.number,
	}

	createLeafletElement(props){
		const { delegate, ...options }= this.getOptions(props);
		const { pane } = this.context;
		return canvasLayer(delegate, pane, options);
	}

}
