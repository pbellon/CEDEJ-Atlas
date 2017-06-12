import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { areaColor } from './styles';
import * as d3 from 'd3';
import * as stripes from './stripes';
import * as boundaries from './boundaries';
import * as topo from 'topojson';
import * as simplify from 'topojson-simplify'; 

export default class CanvasTestComponent extends Component {
  static propTypes = {
    data: PropTypes.shape({
			temperatures:PropTypes.object, 
			aridity:PropTypes.object,
		}),
    width: PropTypes.number,
    height: PropTypes.number,
  }
  constructor(props){
		const filter = (topo)=>{
			const fn = simplify.filterAttached(topoAridity);
			return (ring)=>!fn(ring)
		};

    super(props);
		const { useSimplification=true, data:{ temperatures, aridity }} = props;
		let topoTemp    = useSimplification ? simplify.presimplify(temperatures, simplify.planarRingArea) : temperatures;
		let topoAridity = useSimplification ? simplify.presimplify(aridity, simplify.planarRingArea) : aridity;
		topoAridity = simplify.filter(topoAridity, filter);

    this.temperatures = topo.feature(topoTemp, topoTemp.objects.areas);
		this.aridity = topo.feature(topoAridity, topoAridity.objects.patterns);
  }

  aridityPattern({properties}){
    return this.patterns.find((stripes)=>(stripes.key === properties.type));
  }

  drawCanvas(canvas){
    const context = this.context = canvas.getContext("2d");
    const { width, height, scale=500, center=[0,30] } = this.props;
    const node = d3.select(canvas);
    const proj = this.projection = d3.geoMercator().scale(scale).center(center);
   		
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
    this.temperatures.features.forEach((temp)=>this.drawArea(temp));

    context.globalCompositeOperation = 'destination-out';
    // create aridity textures and substract them from areas paths (if needed)
    // draw aridity boundaries (for certains kinds of aridity)
    this.aridity.features.forEach((aridity)=>this.drawPattern(aridity));
    
		context.globalCompositeOperation = 'source-over';
    this.aridity.features.forEach((aridity)=>this.drawBoundaries(aridity)); 
  }

	drawArea(area){
		const color = areaColor(area);
    this.context.fillStyle = color;
		this.context.strokeStyle = color;
		this.context.strokeWidth = 1;
    this.context.beginPath();
    this.drawPath(area);
		this.context.stroke();
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

	drawBoundaries(aridity){
    const pattern = this.aridityPattern(aridity);
		if(!pattern){ return; }
		boundaries.addBoundaries({
			context:this.context, 
			projection:this.projection,
			boundaries:aridity, 
			pattern
		});
	}


  render(){
    const { width, height } = this.props;
    return <canvas
      ref={ (ref) => this.drawCanvas(ref) }
      width={ width }
      height={ height } />
  }
}
