import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { areaColor } from './styles';
import * as d3 from 'd3';
import * as patterns from './patterns';
import * as boundaries from './boundaries'; 
import * as topojson from 'topojson';

export default class CanvasTestComponent extends Component {
  static propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
  }
  constructor(props){
    super(props);
    const { temperatures, aridity } = props.data;
		console.log(props.data);
    this.temperatures = temperatures.features;
		this.aridity = aridity.features;
  }

  aridityPattern({properties}){
    return this.patterns.find((stripes)=>(stripes.key === properties.type));
  }

  drawCanvas(canvas){
    const context = this.context = canvas.getContext("2d");
    const { data, width, height } = this.props;
    const node = d3.select(canvas);
    const projection = this.projection = d3.geoMercator().scale(500).center([0, 30]);
   		
		this.drawPath = d3.geoPath().projection(projection).context(context);
    this.patterns = patterns.initPatterns(context);

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
    this.aridity.forEach((aridity)=>this.drawPattern(aridity));
    
		context.globalCompositeOperation = 'source-over';
    boundaries.addBoundaries({
			projection,
			context,
			boundaries: this.aridity
		});
  }

	drawArea(area){
    this.context.fillStyle = areaColor(area);
    this.context.beginPath();
    this.drawPath(area);
    this.context.fill();
	}


	drawPattern(aridity){
    const pattern = this.aridityPattern(aridity);
		if(!pattern){ return; }
		if(!pattern.stripes){ return; }
   	this.context.fillStyle = pattern.pattern;
    this.context.beginPath();
    this.drawPath(aridity);
    this.context.fill();
	}

  render(){
    const { width, height } = this.props;
    return <canvas
      ref={ (ref) => this.drawCanvas(ref) }
      width={ width }
      height={ height } />
  }
}
