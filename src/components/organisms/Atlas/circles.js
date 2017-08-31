import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LayerGroup, Circle, Polygon } from 'react-leaflet';
import { circleStyle } from './styles';
import TrianglePoints from './triangle'; 

class CirclesLayer extends Component {
  constructor(props){
    super(props)
    this.sizes = {};
  }

  addToSizes(circle, $ref){
    const { onCirclesCreated } = this.props;
    const size = circle.properties.size_;
    if(!this.sizes[size]){
      this.sizes[size] = $ref;
      if(this.hasAllSizes()){
        onCirclesCreated(this.sizes);
      }
    }
  }
  
  hasAllSizes(){
    return this.sizeKeys.every((key)=>this.sizes[key]!=null)
  }

  updateSizeKeys(circles){
    this.sizeKeys = circles.map(({ properties }) => properties.size_)
      .filter((size)=>size !== '01');
  }
  render(){
    const {
      show=true,
      circles,
      showContextualInfo,
      hideContextualInfo,
    } = this.props;
    this.updateSizeKeys(circles);
    return (
      <LayerGroup>
      {
        circles.map((circle,key)=>{
          let elem; // the element to return
          const coords = circle.geometry.coordinates;
          const center = [ coords[1], coords[0]];
          const size = circle.properties.size_;
          const radius = 10000 + 5000 * parseInt(size);
          const style = circleStyle(circle);
          style.fillOpacity= show?1:0;
          if(size == '01'){
            const points = TrianglePoints(center, radius);
            elem = (
              <Polygon
                { ...style  }
                positions={ points }
                key={ key }/>
            );
          } else {
            elem = (
              <Circle
                ref={ (ref)=>this.addToSizes(circle, ref) }
                key={key}
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
