import React from 'react';
import styled from 'styled-components';
import { Svg as GenericSvg } from 'components' 

import * as circlesUtils from 'utils/circles';

const Svg = styled(GenericSvg)`
  circle, polygon {
    fill: none;
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
    <polygon points={`1 1, ${radius*2} 1, ${radius} ${radius*2}`}/>
  </Symbol>
);

const Circle = ({radius}) => (
  <Symbol radius={radius}>
    <circle cx={radius+1} cy={radius+1} r={radius}/>
  </Symbol>
);

const Holder = styled.table`
  width: 100%;
  table-layout: fixed;
`;

const Str = styled.tr`
  vertical-align: middle;
`;
const Std = styled.td.attrs({colSpan:1})`
  text-align: center;
  vertical-align: middle;
`;

const Description = styled.span`
  font-size: 0.6rem;
`;

const LegendElement = ({size})=>{
  let symbol = <Circle radius={size.radius}/>;
  if(size.key === '01') {
    symbol = <Triangle radius={size.radius}/>;
  }
  return (<Std>
    { symbol }
    <Description>&nbsp;{ circlesUtils.monthsDescription(size.key) }</Description>
  </Std>);
}

const PrintCircleMonthRangeLegend = ({sizes})=>{
  const sizesArr = Object.keys(sizes).map(key => ({
    radius: sizes[key],
    key,
  }));
  sizesArr.sort((a,b)=>{
    return parseInt(a.key) > parseInt(b.key);
  })
  if(!(sizesArr.length > 0)){ return null; }
  return (
    <Holder>
      <tbody>
        <Str>
        { sizesArr.map((size, key)=>(
          <LegendElement key={key} size={size}/>
        ))}
        </Str>
      </tbody>
    </Holder>
  );
};

export default PrintCircleMonthRangeLegend;
