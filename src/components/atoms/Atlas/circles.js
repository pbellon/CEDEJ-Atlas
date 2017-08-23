import React from 'react';
import PropTypes from 'prop-types';

import { LayerGroup, Circle } from 'react-leaflet';
import { circleStyle } from './styles';

const CirclesLayer = ({
  show=true,
  circles,
  showContextualInfo,
  hideContextualInfo 
})=>{
  return (
    <LayerGroup>
      {
        circles.map((circle,key)=>{
          const coords = circle.geometry.coordinates;
          const center = [ coords[1], coords[0]];
          const radius = 10000 + 5000 * parseInt(circle.properties.size_);
          const style = circleStyle(circle);
          style.fillOpacity= show?1:0;
          return (
            <Circle
              onmouseover={ ()=>showContextualInfo({ circles: circle })}
              onmouseout={ ()=>hideContextualInfo() }
              key={key}
              radius={radius}
              center={center}
              {...style} />
          );
        })
      }
    </LayerGroup>
  );
}

export default CirclesLayer;
