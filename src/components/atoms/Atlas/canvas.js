import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { areaColor } from './styles';
import * as d3 from 'd3';
import * as stripes from './stripes';
import * as boundaries from './boundaries'; 

console.log('boundaries', boundaries);

export default class CanvasTestComponent extends Component {
  static propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
  }
  constructor(props){
    super(props);
    const { temperature, aridity } = props.data;
    this.temperatures = temperature.features;
    this.aridity = aridity.features;
  }

  aridityPattern({properties}){
    return this.patterns.find((stripes)=>(stripes.key === properties.type));
  }

  drawCanvas(canvas){
    const context = this.context = canvas.getContext("2d");
    const { data, width, height } = this.props;
    const node = d3.select(canvas);
    const proj = this.projection = d3.geoMercator().scale(950).center([-100, 60]);
   		
		this.drawPath = d3.geoPath().projection(proj).context(context);
    this.patterns = stripes.initPatterns(context);

    // if (window.devicePixelRatio > 1) {
    //   const devicePixelRatio = window.devicePixelRatio || 1;
    //   const backingStoreRatio = context.webkitBackingStorePixelRatio || context.backingStorePixelRatio || 1;
    //   const ratio = devicePixelRatio / backingStoreRatio;
    //   node
    //     .attr('width', width * ratio)
    //     .attr('height', height * ratio)
    //     .style('width', `${width} px`)
    //     .style('height', `${height} px`);
    // }

    context.globalCompositeOperation = 'source-over';
    // draw zones with different colors to do
    // context.globalCompositeOperation = 'destination-in';
    this.temperatures.forEach((temp)=>this.drawArea(temp));

    context.globalCompositeOperation = 'destination-out';
    // create aridity textures and substract them from areas paths (if needed)
    // draw aridity boundaries (for certains kinds of aridity)
    this.aridity.forEach((aridity)=>this.drawAridity(aridity)); 
  }

	drawArea(area){
    this.context.fillStyle = areaColor(area);
    this.context.beginPath();
    this.drawPath(area);
    this.context.fill();
	}


	drawPattern(aridity, pattern){
	  if(!pattern.stripes){ return; }
   	this.context.fillStyle = pattern.pattern;
    this.context.beginPath();
    this.drawPath(aridity);
    this.context.fill();
	}

	drawBoundaries(aridity, pattern){
		boundaries.addBoundaries({
			context:this.context, 
			projection:this.projection,
			boundaries:aridity, 
		pattern});
	}

  drawAridity(aridity){
  	if(aridity.properties.type == 0){ return; }
    const pattern = this.aridityPattern(aridity);
		this.drawPattern(aridity, pattern);
		this.drawBoundaries(aridity, pattern);
	}


  render(){
    const { width, height } = this.props;
    return <canvas
      ref={ (ref) => this.drawCanvas(ref) }
      width={ width }
      height={ height } />
  }
}
