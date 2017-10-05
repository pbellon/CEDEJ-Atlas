import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { font, palette } from 'styled-theme';
import {
  LegendContent,
  LegendToggleButton,
  LegendTooltips,
} from 'components';

import { legend } from 'utils/styles';

const Legend = styled.div`
  font-family: ${font('primary')};
  background: ${palette('white', 1)};
  position: absolute;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  transform: translate(${({ isOpened }) => isOpened ? 0 : '-87%'}, 0);
  padding: 5px;
  padding-top: 0;
  max-width: ${legend.width}px;
  overflow: ${({ isOpened }) => isOpened ? 'auto' : 'hidden'};
  transition: transform .5s ease-in-out;

  &.legend--print {
    font-family: Arial, sans-serif;
    max-width: 700px;
    position: static;
    top: auto;
    overflow: visible;
    [data-tip]:after {
      display: none;
    }
  }
`;


const VisibleIfOpened = styled.div`
  transition: opacity .5s ease;
  opacity: ${({ isOpened }) => isOpened ? 1 : 0};
  pointer-events: ${({ isOpened }) => isOpened ? 'auto' : 'none'};
`;

const visibilityButtonStyle = {
  position: 'absolute',
  right: 0,
  left: 0,
};

const AtlasLegend = ({
  isOpened,
  filters,
  layers,
  print,
  circleSizes,
}) => {
  return (
    <div>
      <Legend
        className={`legend ${print ? 'legend--print' : ''}`}
        isOpened={isOpened}
      >
        { !print && (
          <LegendToggleButton style={visibilityButtonStyle} />
        )}
        <VisibleIfOpened isOpened={isOpened}>
          <LegendContent
            circleSizes={circleSizes}
            print={print}
            layers={layers}
            filters={filters}
          />
        </VisibleIfOpened>
      </Legend>
      <LegendTooltips layers={layers} filters={filters} />
    </div>
  );
};

AtlasLegend.propTypes = {
  layers: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  circleSizes: PropTypes.object.isRequired,
  print: PropTypes.bool,
  isOpened: PropTypes.bool,

};

AtlasLegend.defaultProps = {
  print: false,
  isOpened: true,
};

export default AtlasLegend;
