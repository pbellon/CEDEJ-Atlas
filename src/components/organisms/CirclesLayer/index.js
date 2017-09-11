import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LayerGroup, Circle, Polygon } from 'react-leaflet';
import { circleColor } from 'utils/circles';
import TrianglePoints from './triangle'; 
const visibleTypes = types => (
  Object.keys(types)
    .map(key => types[key])
    .filter(type => type.visible)
);

const circleStyle = (circle, types) => {
  if(types[circle.properties.colours].visible){
    const color = circleColor(circle);
    return {
      stroke: false,
      fillOpacity: 1,
      opacity:1,
      color: color,
      fillColor: color,
    };
  } else {
    return {
      stroke: true,
      fillOpacity: 0,
      fillColor: 'transparent',
      color: 'black',
      weight: 2,
    }
  }
};

class CirclesLayer extends Component {
  constructor(props){
    super(props)
    this.sizes = {};
  }

  addToSizes(circle, $ref){
    const { onCirclesCreated, onRender } = this.props;
    const size = circle.properties.size_;
    if(!this.sizes[size]){
      this.sizes[size] = $ref;
      if(this.hasAllSizes()){
        onCirclesCreated(this.sizes);
      }
    }
  }

  bindElement(ref, elem, type){
    if(type === 'circle'){
      this.addToSizes(elem, ref);
    }
    this.renderedElements += 1; 
    if(this.renderedElements === this.props.circles.length){
      this.props.onRender();
    }
  }

  hasAllSizes(){
    return this.sizeKeys.every((key)=>this.sizes[key]!=null)
  }
  
  updateSizeKeys(circles){
    this.sizeKeys = circles.map(({ properties }) => properties.size_)
      .filter((size)=>size !== '01');
  }

  shouldComponentUpdate(toProps){
    
    const fromVisibleTypes = visibleTypes(this.props.types);
    const toVisibleTypes = visibleTypes(toProps.types); 

    if(fromVisibleTypes.length != toVisibleTypes.length){
      return true;
    }
    if(this.props.show !== toProps.show){
      return true;
    }
    if(this.props.circles.length !== toProps.circles.length){ return true; }
    return false;
  }

  render(){
    const {
      show=true,
      circles,
      types,
    } = this.props;
    
    this.renderedElements = 0;
    this.updateSizeKeys(circles);
    
    if(circles.length === 0){
      this.props.onRender();
      return null;
    }
    
    return (
      <LayerGroup>
      {
        circles.map((circle,key)=>{
          let elem; // the element to return
          const coords = circle.geometry.coordinates;
          const center = [ coords[1], coords[0]];
          const size = circle.properties.size_;
          const radius = 10000 + 5000 * parseInt(size);
          const style = circleStyle(circle, types);
          style.fillOpacity= show?1:0;
          if(size === '01'){
            const points = TrianglePoints(center, radius);
            elem = (
              <Polygon
                ref={ (ref) => this.bindElement(ref, circle, 'triangle') }
                { ...style  }
                positions={ points }
                key={ key }/>
            );
          } else {
            elem = (
              <Circle
                ref={ (ref)=>this.bindElement(ref, circle, 'circle') }
                key={key}
                interactive={false}
                radius={radius}
                center={center}
                {...style} />
            );
          }
          return elem;
        })
      }
      </LayerGroup>
    );

  } 
}

export default CirclesLayer;
