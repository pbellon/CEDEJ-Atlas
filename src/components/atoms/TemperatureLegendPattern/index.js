import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Td } from 'components';
import * as boundaries from 'utils/boundaries';
const areaPatternPath = ({ width: w, height:h })=>`
  M2,2L${w - 2},2L${w - 2},${h - 2}L2,${h - 2}Z
`;

class AreaPattern extends Component {
  drawCanvas(canvas) {
    if(!canvas){ return; } 
    const { patterns, aridity, temperature:pTemperature } = this.props;
    const context = canvas.getContext('2d');
    let pattern; 
    let temperature = pTemperature; 
    if(aridity){ pattern = patterns.findByKey(aridity.name); }
    const p = areaPatternPath(canvas);
    const props = new boundaries.pathProperties(p);
    const path = {
      isExterior: true,
      path: p,
      properties: props,
      length: props.totalLength()
    };

    const p2d = new Path2D(path.path);
    if (!temperature) {
      temperature = { color: 'white' }
    }
    
    context.fillStyle = temperature.color;
    context.fill(p2d);
    
    if(pattern && pattern.stripes){

      /// context.globalCompositeOperation = 'destination-out';
      context.fillStyle = pattern.canvasPattern;
      context.beginPath();
      context.fill(p2d);
      context.closePath();
    }
    if(aridity){
      context.globalCompositeOperation = 'source-over';
      boundaries.addBoundary({ context, path, pattern, gap: 20 });
    } 
  
  }

  render() {
    return (
      <Td>
        <canvas
          width={ 35 }
          height={ 15 }
          ref={(canvas)=>this.drawCanvas(canvas)}/>
      </Td>
    );
  }
}

export default AreaPattern; 
