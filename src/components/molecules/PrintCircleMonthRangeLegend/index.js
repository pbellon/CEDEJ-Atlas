import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { CanvasCircle, CanvasTriangle } from 'components';

import { monthsDescription } from 'utils/circles';

const Holder = styled.table`
  width: 100%;
  table-layout: fixed;
  text-align: center;
`;

const Str = styled.tr`
  vertical-align: text-top;
`;

const Std = styled.td.attrs({ colSpan: 1 })`
  vertical-align: text-top;
  position: relative;
  height: ${({ height }) => height}px;
`;

const Description = styled.span`
  font-size: 0.6rem;
`;

const LegendElement = ({ size, height: elHeight }) => {
  const width = (size.radius * 2) + 2;
  const height = width;
  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  };

  let symbol = <CanvasCircle style={style} width={width} height={height} radius={size.radius} />;
  if (size.key === '01') {
    symbol = <CanvasTriangle style={style} width={width} height={height} radius={size.radius} />;
  }
  return <Std height={elHeight}>{ symbol }</Std>;
};

LegendElement.propTypes = {
  size: PropTypes.object,
  height: PropTypes.number,
};

const Dtr = styled.tr`
  vertical-align: bottom;
`;
const Dtd = styled.td`
  vertical-align: bottom;
`;

const PrintCircleMonthRangeLegend = ({ sizes }) => {
  const sizesArr = Object.keys(sizes).map(key => ({
    radius: sizes[key],
    key,
  }));

  sizesArr.sort((a, b) => (
    parseInt(a.key, 10) > parseInt(b.key, 10)
  ));

  if (!(sizesArr.length > 0)) { return null; }
  const maxHeight = (sizesArr[sizesArr.length - 1].radius * 2) + 2;

  return (
    <Holder>
      <tbody>
        <Dtr>
          { sizesArr.map(({ key: skey }, key) => (
            <Dtd key={key}>
              <Description>
                { monthsDescription(skey) }
              </Description>
            </Dtd>
          ))}
        </Dtr>
        <Str>
          { sizesArr.map((size, key) => (
            <LegendElement height={maxHeight} key={key} size={size} />
          ))}
        </Str>
      </tbody>
    </Holder>
  );
};

PrintCircleMonthRangeLegend.propTypes = {
  sizes: PropTypes.object,
};

export default PrintCircleMonthRangeLegend;
