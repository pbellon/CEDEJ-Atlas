import React from 'react';
import styled from 'styled-components';
import { Svg as GenericSvg } from 'components' 

import * as circlesUtils from 'utils/circles';

const Svg = styled(GenericSvg)`
  
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  
  circle, polygon {
    fill: rgba(255,255,255,0);
    stroke-width: 1px;
    stroke: #BBB;
  }
`;

const Symbol = ({ radius, children }) => {
  const width = (radius * 2) + 2;
  return (
    <Svg viewBox={`0 0 ${width} ${width}`} height={width} width={width}>
      { children }
    </Svg>
  );
};

const Triangle = ({radius}) => (
  <Symbol radius={radius}>
    <polygon 
      stroke="#bbb"
      strokeWidth="1px"
      fill="rgba(255, 255, 255, 0)" 
      points={`1 1, ${radius*2} 1, ${radius} ${radius*2}`}/>
  </Symbol>
);

const Circle = ({radius}) => (
  <Symbol radius={radius}>
    <circle
      stroke="#bbb"
      strokeWidth="1px"
      fill="rgba(255, 255, 255, 0)" 
      cx={radius+1} cy={radius+1} r={radius}/>
  </Symbol>
);

const Holder = styled.table`
  width: 100%;
  table-layout: fixed;
  text-align: center;
`;

const Str = styled.tr`
  vertical-align: text-top;
`;
const Std = styled.td.attrs({colSpan:1})`
  vertical-align: text-top;
  position: relative;
  height: ${({height})=>height}px;
`;

const Description = styled.span`
  font-size: 0.6rem;
`;

const LegendElement = ({size, height})=>{
  let symbol = <Circle radius={size.radius}/>;
  if(size.key === '01') {
    symbol = <Triangle radius={size.radius}/>;
  }
  return <Std height={height}>{ symbol }</Std>;
}

const Dtr = styled.tr`
  vertical-align: bottom;
`;
const Dtd = styled.td`
  vertical-align: bottom;
`;
const PrintCircleMonthRangeLegend = ({sizes})=>{
  const sizesArr = Object.keys(sizes).map(key => ({
    radius: sizes[key],
    key,
  }));
  sizesArr.sort((a,b)=>{
    return parseInt(a.key) > parseInt(b.key);
  })
  if(!(sizesArr.length > 0)){ return null; }
  const maxHeight = sizesArr[sizesArr.length - 1].radius;

  return (
    <Holder>
      <tbody>
        <Dtr>
          { sizesArr.map(({key:skey}, key)=>(
            <Dtd key={key}>
              <Description>
                { circlesUtils.monthsDescription(skey) }
              </Description>
            </Dtd>
          ))}
        </Dtr>
        <Str>
        { sizesArr.map((size, key)=>(
          <LegendElement height={maxHeight} key={key} size={size}/>
        ))}
        </Str>
      </tbody>
    </Holder>
  );
};

export default PrintCircleMonthRangeLegend;
