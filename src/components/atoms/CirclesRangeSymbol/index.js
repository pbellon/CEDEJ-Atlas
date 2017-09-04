import React from 'react';

import './style.css';

const baseShapeStyle = {
  fill: 'none',
  stroke: '#000000',
  strokeMiterlimit: 4,
  strokeLinejoin: 'miter',
  storkeOpacity: 1
};
const circleStyle = {
  ...baseShapeStyle,
  strokeWidth:1,
  strokeDasharray:'none',
};
const dashedCircleStyle = {
  ...baseShapeStyle,
  strokeWidth:0.7,
  strokeDasharray:'3, 3',
  strokeDashoffset:0,
};

const triangleStyle = {
  ...baseShapeStyle,
  strokeWidth: 0.7,
};

const CircleRangeSymbol = ({ width, height }) => (

  <svg
   width={width}
   height={height}
   viewBox={'0 0 50 50'}>
  <g
     transform={'translate(0,-1002.3622)'}>
    <circle
       style={circleStyle}
       cy={1027.3622}
       cx={25}
       r={24} />
    <circle
       style={dashedCircleStyle}
       cy={1030}
       cx={25}
       r={20} />
    <circle
       style={{
         ...dashedCircleStyle,
        strokeDashoffset:1.85,
       }}
       cy={1035}
       cx={25}
       r={15} />
    <path
       style={triangleStyle}
       d={'m 15.80357,1031.648 9.696142,-0.062 9.696142,-0.062 -4.794069,8.4283 -4.794069,8.4283 -4.902073,-8.366 z'}
       transform={'matrix(0.99997317,0.00732457,-0.00732457,0.99997317,7.0566701,-0.15921565)'} />
  </g>
</svg>
);

export default CircleRangeSymbol; 
