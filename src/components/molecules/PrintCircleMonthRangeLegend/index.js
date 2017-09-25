import React from 'react';
import styled from 'styled-components';

import { Svg as GenericSvg, CanvasCircle, CanvasTriangle } from 'components' 

import * as circlesUtils from 'utils/circles';

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

const LegendElement = styled(({size, height:elHeight})=>{
  const width = (size.radius * 2) + 2;
  const height = width;

  let symbol = <CanvasCircle width={width} height={height} radius={size.radius}/>;
  if(size.key === '01') {
    symbol = <CanvasTriangle width={width} height={height} radius={size.radius}/>;
  }
  return <Std height={elHeight}>{ symbol }</Std>;
})`
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 0;
  }
`;

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
  const maxHeight = (sizesArr[sizesArr.length - 1].radius * 2) + 2;

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
